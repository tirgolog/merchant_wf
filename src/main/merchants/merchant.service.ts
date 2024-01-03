import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Merchant } from './entities/merchant.entity';
import { MerchantDto } from './merchant.dto';
import { BpmResponse, User, Role, Cargo, Transaction } from '..';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant) private readonly merchantsRepository: Repository<Merchant>,
    @InjectRepository(BankAccount) private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Cargo) private readonly cargosRepository: Repository<Cargo>,
    @InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>
  ) { }

  async getMerchants() {
    try {
      const data: any = await this.merchantsRepository.find({
        where: { active: true },
        relations: ['users', 'cargos']
      });
      for (let i = 0; i < data.length; i++) {
        const bankAccount: any = await this.bankAccountRepository.find({ where: { active: true, merchantId: data[i].id }, relations: ['currency'] })
        const accountData = bankAccount.map((el: any) => {
          return { account: el.account, currencyName: el.currency?.name }
        })
        data[i].bankAccounts = accountData;
      }
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async getVerifiedMerchants() {
    try {
      const data: any = await this.merchantsRepository.find({
        where: { active: true, verified: true },
        relations: ['users', 'cargos']
      });
      let transactions = await this.transactionsRepository.find({where: { active: true, verified: true }, relations: ['merchant']});
      const cargos = await this.cargosRepository.find({ where: { active: true }, relations: ['merchant'] });
      for (let i = 0; i < data.length; i++) {
        const bankAccount: any = await this.bankAccountRepository.find({ where: { active: true, merchantId: data[i]?.id }, relations: ['currency'] })
        const accountData = bankAccount.map((el: any) => {
          return { account: el.account, currencyName: el.currency?.name }
        })
        data[i].bankAccounts = accountData;
        data[i].cargosCount = cargos.filter((el: any) => el.merchant['id'] == data[i].id).length;
        const rawTransactions = transactions.filter((el: any) => el.merchant['id'] == data[i]?.id);
        const topup = rawTransactions.filter((el: any) => el.transactionType == 'topup').reduce((a: any, b: any) => a + b.amount, 0);
        const withdraw = rawTransactions.filter((el: any) => el.transactionType == 'withdrow').reduce((a: any, b: any) => a + b.amount, 0);
      }
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  } 

  async getUnverifiedMerchants() {
    try {
      const data: any = await this.merchantsRepository.find({
        where: { active: true, verified: false, rejected: false },
        relations: ['users']
      });
      for (let i = 0; i < data.length; i++) {
        const bankAccount: any = await this.bankAccountRepository.find({ where: { active: true, merchantId: data[i].id }, relations: ['currency'] })
        const accountData = bankAccount.map((el: any) => {
          return { account: el.account, currencyName: el.currency?.name }
        })
        data[i].bankAccounts = accountData;
      }
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async findMerchantById(id: number) {
    try {
      const data = await this.merchantsRepository.findOne({ where: { id, active: true } });
      if (data) {
          const bankAccount: any = await this.bankAccountRepository.find({ where: { active: true, merchantId: data.id }, relations: ['currency'] })
          const accountData = bankAccount.map((el: any) => {
            return { account: el.account, currencyName: el.currency?.name }
          })
          data.bankAccounts = accountData;
        return new BpmResponse(true, data, null);
      } else {
        return new BpmResponse(false, null, ['Not found']);
      }
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async getMerchantByEmail(email: string) {
    try {
      if(!email) {
        return new BpmResponse(false, null, ['Email is required']);  
      }
      const data = await this.merchantsRepository.findOneOrFail({ where: { email, active: true } });
      if (data) {
        return new BpmResponse(true, data, null);
      } else {
        return new BpmResponse(false, null, ['Not found']);
      }
    }
    catch (error: any) {
      console.log(error)
      return new BpmResponse(false, null, ['Not found']);
    }
  }

  async findMerchantByEmail(email: string) {
    return await this.merchantsRepository.findOne({ where: { email } });
  }

  async createMerchant(createMerchantDto: MerchantDto) {
    try {
      const saltOrRounds = 10;
      const passwordHash = await bcrypt.hash(createMerchantDto.password, saltOrRounds);
      const merchant: Merchant = await this.merchantsRepository.create();
      merchant.email = createMerchantDto.email;
      merchant.password = passwordHash;
      merchant.phoneNumber = createMerchantDto.phoneNumber;
      merchant.companyName = createMerchantDto.companyName;
      merchant.responsiblePerson = createMerchantDto.responsiblePerson;

      if (createMerchantDto.registrationCertificateFilePath) {
        merchant.registrationCertificateFilePath = createMerchantDto.registrationCertificateFilePath;
      }
      if (createMerchantDto.passportFilePath) {
        merchant.passportFilePath = createMerchantDto.passportFilePath;
      }
      if (createMerchantDto.logoFilePath) {
        merchant.logoFilePath = createMerchantDto.logoFilePath;
      }
      if (createMerchantDto.notes) {
        merchant.notes = createMerchantDto.notes;
      }
      if (createMerchantDto.mfo) {
        merchant.mfo = createMerchantDto.mfo;
      }
      if (createMerchantDto.inn) {
        merchant.inn = createMerchantDto.inn;
      }
      if (createMerchantDto.oked) {
        merchant.oked = createMerchantDto.oked;
      }
      if (createMerchantDto.dunsNumber) {
        merchant.dunsNumber = createMerchantDto.dunsNumber;
      }
      if (createMerchantDto.supervisorFullName) {
        merchant.supervisorFullName = createMerchantDto.supervisorFullName;
      }
      if (createMerchantDto.legalAddress) {
        merchant.legalAddress = createMerchantDto.legalAddress;
      }
      if (createMerchantDto.factAddress) {
        merchant.factAddress = createMerchantDto.factAddress;
      }
      if (createMerchantDto.bankName) {
        merchant.bankName = createMerchantDto.bankName;
      }

      const newMerchant = await this.merchantsRepository.save(merchant);
      if (createMerchantDto.bankAccounts) {
        createMerchantDto.bankAccounts.forEach((el: any) => el.merchantId = newMerchant.id)
        const accounts: any = createMerchantDto.bankAccounts
        this.bankAccountRepository
          .createQueryBuilder()
          .insert()
          .into(BankAccount)
          .values(accounts)
          .execute()
      }
      if (newMerchant) {
        return new BpmResponse(true, newMerchant, null)
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateMerchant(id: number, updateMerchantDto: MerchantDto): Promise<BpmResponse> {
    try {

      const merchant: Merchant = await this.merchantsRepository.findOneBy({ id });

      merchant.email = updateMerchantDto.email;
      merchant.phoneNumber = updateMerchantDto.phoneNumber;
      merchant.companyName = updateMerchantDto.companyName;
      
      if (updateMerchantDto.password) {
        const saltOrRounds = 10;
        const passwordHash = await bcrypt.hash(updateMerchantDto.password, saltOrRounds);
        merchant.password = passwordHash;
      }
      if (updateMerchantDto.responsiblePerson) {
        merchant.responsiblePerson = updateMerchantDto.responsiblePerson;
      }
      if (updateMerchantDto.registrationCertificateFilePath) {
        merchant.registrationCertificateFilePath = updateMerchantDto.registrationCertificateFilePath;
      }
      if (updateMerchantDto.passportFilePath) {
        merchant.passportFilePath = updateMerchantDto.passportFilePath;
      }
      if (updateMerchantDto.logoFilePath) {
        merchant.logoFilePath = updateMerchantDto.logoFilePath;
      }
      if (updateMerchantDto.notes) {
        merchant.notes = updateMerchantDto.notes;
      }
      if (updateMerchantDto.mfo) {
        merchant.mfo = updateMerchantDto.mfo;
      }
      if (updateMerchantDto.inn) {
        merchant.inn = updateMerchantDto.inn;
      }
      if (updateMerchantDto.oked) {
        merchant.oked = updateMerchantDto.oked;
      }
      if (updateMerchantDto.dunsNumber) {
        merchant.dunsNumber = updateMerchantDto.dunsNumber;
      }
      if (updateMerchantDto.supervisorFullName) {
        merchant.supervisorFullName = updateMerchantDto.supervisorFullName;
      }
      if (updateMerchantDto.legalAddress) {
        merchant.legalAddress = updateMerchantDto.legalAddress;
      }
      if (updateMerchantDto.factAddress) {
        merchant.factAddress = updateMerchantDto.factAddress;
      }
      if (updateMerchantDto.bankName) {
        merchant.bankName = updateMerchantDto.bankName;
      }
      const updatedMerchant = await this.merchantsRepository.update({ id: merchant.id }, merchant);
      if (updateMerchantDto.bankAccounts) {
        await this.bankAccountRepository.delete({ merchantId: merchant.id });
        updateMerchantDto.bankAccounts.forEach((el: any) => el.merchantId = merchant.id)
        const accounts: any = updateMerchantDto.bankAccounts;
        this.bankAccountRepository
          .createQueryBuilder()
          .insert()
          .into(BankAccount)
          .values(accounts)
          .execute()
      }
      if (updatedMerchant) {
        return new BpmResponse(true, updatedMerchant, null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async verifyMerchant(id: number): Promise<BpmResponse> {
    try {

      const merchant: Merchant = await this.merchantsRepository.findOneBy({ id });
      if (merchant) {
        merchant.verified = true;
        const verifed = await this.merchantsRepository.save(merchant);
        if (verifed) {
          const role = (await this.rolesRepository.findOne({ where: { name: 'Super admin' }}))?.id;
          // const saltOrRounds = 10;
          // const passwordHash = await bcrypt.hash(merchant.password, saltOrRounds);
          const userObj: any = {
            fullName: merchant.supervisorFullName,
            password: merchant.password,
            username: merchant.email,
            phoneNumber: merchant.phoneNumber,
            merchant: id,
            role: role
          }
          this.usersRepository.save(userObj);
          return new BpmResponse(true, null, ['Merchant verified']);
        }
      } else {
        return new BpmResponse(false, null, ['Merchant not found']);
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async rejectMerchant(id: number): Promise<BpmResponse> {
    try {

      const merchant: Merchant = await this.merchantsRepository.findOneBy({ id });
      if (merchant) {
        merchant.rejected = true;
        const verifed = await this.merchantsRepository.save(merchant);
        if (verifed) {
          return new BpmResponse(true, null, ['Merchant rejected']);
        }
      } else {
        return new BpmResponse(false, null, ['Merchant not found']);
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteMerchant(id: number): Promise<BpmResponse> {
    const isDeleted = await this.merchantsRepository.createQueryBuilder()
      .update(Merchant)
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