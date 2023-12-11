import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse } from '..';
import { Transaction } from './transaction.entity';
import { TransactionDto } from './transaction.dto';
import { CustomHttpException } from 'src/shared/exceptions/custom-http-exception';
import axios from 'axios';
@Injectable()
export class TransactionService {

  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>,
  ) { }

  async getTransactions(): Promise<BpmResponse> {
    try {
      const data = await this.transactionsRepository.find({
        where: { active: true },
        select: ['amount', 'createdAt', 'createdBy', 'id', 'transactionType'],
        relations: ['createdBy'],
      });
      return new BpmResponse(true, data, null);
    } catch (error: any) {
      this.logger.error(`Error while fetching transactions: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while fetching transactions', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async getTransactionsByMerchant(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      let data = await this.transactionsRepository.find({
        where: { active: true },
        relations: ['createdBy', 'merchant']
      });
      data = data.filter((el: any) => el.merchant?.id == id);
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      this.logger.error(`Error while fetching transactions by merchant: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while fetching transactions by merchant', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async getVerifiedTransactionsByMerchant(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      let data = await this.transactionsRepository.find({
        where: { active: true, verified: true },
        relations: ['createdBy', 'merchant']
      });
      data = data.filter((el: any) => el.merchant?.id == id);
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      this.logger.error(`Error while fetching verified transactions: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while fetching verified transactions', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async getRejetedTransactionsByMerchant(id: number): Promise<BpmResponse> {
    try {
      if (!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      let data = await this.transactionsRepository.find({
        where: { active: true, rejected: true },
        relations: ['createdBy', 'merchant']
      });
      data = data.filter((el: any) => el.merchant?.id == id);
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      this.logger.error(`Error while fetching rejected transactions: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while fetching rejected transactions', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async getTransactionsByUser(id: string): Promise<BpmResponse> {
    try {
      if (!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      let data = await this.transactionsRepository.find({
        where: { active: true, verified: true },
        relations: ['createdBy']
      });
      data = data.filter((el: any) => el.createdBy['id'] == id);
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      this.logger.error(`Error while fetching transactions by user: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while fetching transactions by user', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async getToken() {
    await axios.post('https://admin.tirgo.io/api/users/login', { phone: '998935421324' })
    const testData = await axios.post('https://admin.tirgo.io/api/users/codeverify', { phone: '998935421324', code: '00000' })
    return testData.data?.token
  }

  async getMerchantBalance(id: number): Promise<BpmResponse> {
    try {

      if (!id) {
        return new BpmResponse(false, null, ['Merchant is required']);
      }
      let topup = await this.transactionsRepository.find({ where: { active: true, transactionType: 'topup', verified: true }, relations: ['merchant'] });
      topup = topup.filter((el: any) => el.merchant?.id == id)
      let withdrow = await this.transactionsRepository.find({ where: { active: true, transactionType: 'withdrow', verified: true }, relations: ['merchant'] });
      withdrow = withdrow.filter((el: any) => el.merchant?.id == id)

      const topupBalance = topup.reduce((a: any, b: any) => a + b.amount, 0);
      const withdrowBalance = withdrow.reduce((a: any, b: any) => a + b.amount, 0);
      const token = await this.getToken();
      const testData = await axios.get('https://admin.tirgo.io/api/users/getMerchantBalance?clientId=' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = testData.data.data;
      return new BpmResponse(true, { activeBalance: ((topupBalance - 500) - withdrowBalance) + data.totalActiveAmount, frozenBalance: data.totalFrozenAmount }, null)
    } catch (error) {
      this.logger.error(`Error while fetching merchant balance: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while fetching merchant balance', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async findTransactionById(id: string): Promise<BpmResponse> {
    try {
      const data = await this.transactionsRepository.findOne({ where: { id, active: true } });
      if (data) {
        return new BpmResponse(true, data, null);
      } else {
        return new BpmResponse(false, null, ['Not found']);
      }
    } catch (error: any) {
      this.logger.error(`Error while fetching transaction by id: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while fetching transaction by id', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async createTransaction(createTransactionDto: TransactionDto, userId: string): Promise<BpmResponse> {
    try {
      const transaction: Transaction = await this.transactionsRepository.create();
      transaction.transactionType = createTransactionDto.transactionType;
      transaction.amount = createTransactionDto.amount;
      transaction.merchant = createTransactionDto.merchantId;
      transaction.createdBy = userId;

      const newTransaction = await this.transactionsRepository.save(transaction);
      if (newTransaction) {
        return new BpmResponse(true, newTransaction, null)
      }
    } catch (error: any) {
      this.logger.error(`Error while creating transaction: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while creating transaction', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async verifyTransaction(id: string): Promise<BpmResponse> {
    try {
      const transaction: Transaction = await this.transactionsRepository.findOneBy({ id, active: true, rejected: false });
      if (!transaction) {
        return new BpmResponse(false, null, ['Transaction not found']);
      }
      transaction.verified = true;
      const updatedTransaction = await this.transactionsRepository.save(transaction)
      if (updatedTransaction) {
        return new BpmResponse(true, 'Verified', null);
      }

    } catch (error: any) {
      this.logger.error(`Error while verifing transaction: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while verifing transaction', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async rejectTransaction(id: string): Promise<BpmResponse> {
    try {
      const transaction: Transaction = await this.transactionsRepository.findOneBy({ id, active: true, verified: false });
      if (!transaction) {
        return new BpmResponse(false, null, ['Transaction not found']);
      }
      transaction.rejected = true;
      const updatedTransaction = await this.transactionsRepository.save(transaction)
      if (updatedTransaction) {
        return new BpmResponse(true, 'Rejeted', null);
      }

    } catch (error: any) {
      this.logger.error(`Error while rejecting transaction: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while rejecting transaction', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async updateTransaction(id: string, updateTransactionDto: TransactionDto): Promise<BpmResponse> {
    try {
      const transaction: Transaction = await this.transactionsRepository.findOneBy({ id });
      transaction.transactionType = updateTransactionDto.transactionType || transaction.transactionType;
      transaction.amount = updateTransactionDto.amount || transaction.amount;
      transaction.merchant = updateTransactionDto.merchantId || transaction.merchant;

      const updatedTransaction = await this.transactionsRepository.save(transaction)
      if (updatedTransaction) {
        return new BpmResponse(true, updatedTransaction, null);
      }

    } catch (error: any) {
      this.logger.error(`Error while updating transaction: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while updating transaction', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async deleteTransaction(id: string): Promise<BpmResponse> {
    try {
      if (!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      const isDeleted = await this.transactionsRepository.createQueryBuilder()
        .update(Transaction)
        .set({ active: false })
        .where("id = :id", { id })
        .execute();
      if (isDeleted.affected) {
        return new BpmResponse(true, 'Successfully deleted', null);
      } else {
        return new BpmResponse(true, 'Delete failed', null);
      }
    }
    catch (error: any) {
      this.logger.error(`Error while deleting transaction: ${error.message}`, error.stack);
      throw new CustomHttpException('Error while deleting transaction', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}