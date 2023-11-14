import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse } from '..';
import { Transaction } from './transaction.entity';
import { TransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>,
  ) { }

  async getTransactions() {
    try {
      const data = await this.transactionsRepository.find({
        where: { active: true },
        select: ['amount', 'createdAt', 'createdBy', 'id', 'transactionType'],
        relations: ['createdBy']
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    } 
  }

  async getTransactionsByMerchant(id: string) {
    try {
      if(!id) {
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
      console.log(error)
    }
  }

  async getVerifiedTransactionsByMerchant(id: string) {
    try {
      if(!id) {
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
      console.log(error)
    }
  }

  async getRejetedTransactionsByMerchant(id: string) {
    try {
      if(!id) {
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
      console.log(error)
    }
  }

  async getTransactionsByUser(id: string) {
    try {
      if(!id) {
        return new BpmResponse(false, null, ['Id is required']);
      }
      const data = await this.transactionsRepository.find({
        where: { active: true, createdBy: id },
        relations: ['createdBy']
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async getMerchantBalance(id: string) {
    try {

      if(!id) {
        return new BpmResponse(false, null, ['Merchant is required']);
      }
      let topup = await this.transactionsRepository.find({ where: { active: true, transactionType: 'topup' }, relations: ['merchant'] });
      topup = topup.filter((el: any) => el.merchant?.id == id)
      let withdrow = await this.transactionsRepository.find({ where: { active: true, transactionType: 'withdrow' }, relations: ['merchant'] });
      withdrow = withdrow.filter((el: any) => el.merchant?.id == id)
      
      const topupBalance = topup.reduce((a: any, b: any) => a + b.amount, 0);
      const withdrowBalance = withdrow.reduce((a: any, b: any) => a + b.amount, 0);
      console.log({ topup: topupBalance, withdrow: withdrowBalance })
      return new BpmResponse(true, { topup: topupBalance, withdrow: withdrowBalance }, null)
    } catch(error) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findTransactionById(id: string) {
    try {
      const data = await this.transactionsRepository.findOne({ where: { id, active: true } });
      if(data) {
        return new BpmResponse(true, data, null);
      } else {
        return new BpmResponse(false, null, ['Not found']);
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  async createTransaction(createTransactionDto: TransactionDto, userId: string) {
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
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async verifyTransaction(id: string): Promise<BpmResponse> {
    try {
      const transaction: Transaction = await this.transactionsRepository.findOneBy({ id, active: true, rejected: false });
      if(!transaction) {
        return new BpmResponse(false, null, ['Transaction not found']);
      }
      transaction.verified = true;
      const updatedTransaction = await this.transactionsRepository.save(transaction)
      if (updatedTransaction) {
        return new BpmResponse(true, 'Verified', null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async rejectTransaction(id: string): Promise<BpmResponse> {
    try {
      const transaction: Transaction = await this.transactionsRepository.findOneBy({ id, active: true, verified: false });
      if(!transaction) {
        return new BpmResponse(false, null, ['Transaction not found']);
      }
      transaction.rejected = true;
      const updatedTransaction = await this.transactionsRepository.save(transaction)
      if (updatedTransaction) {
        return new BpmResponse(true, 'Verified', null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
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
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteTransaction(id: string): Promise<BpmResponse> {
    if(!id) {
      return new BpmResponse(false, null, ['Id is required']);
    }
    const isDeleted = await this.transactionsRepository.createQueryBuilder()
      .update(Transaction)
      .set({ active: false })
      .where("id = :id", { id })
      .execute();
    if (isDeleted.affected) {
      return new BpmResponse(true, 'Successfully updated', null);
    } else {
      return new BpmResponse(true, 'Update failed', null);
    }
  }
}