import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BpmResponse } from '..';
import { Currency } from './currency.entity';
import { CurrencyDto } from './currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency) private readonly currenciesRepository: Repository<Currency>,
  ) { }

  async getCurrencies() {
    try {
      const data = await this.currenciesRepository.find({
        where: { active: true },
        relations: ['createdBy']
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async findCurrencyById(id: string) {
    try {
      const data = await this.currenciesRepository.findOne({ where: { id, active: true } });
      return new BpmResponse(true, data, null);
    } catch (error: any) {
      console.log(error)
    }
  }

  findCurrencyByName(name: string) {
    return this.currenciesRepository.findOne({ where: { name, active: true } });
  }

  async createCurrency(createCurrencyDto: CurrencyDto, userId: string) {
    try {
      const currency: Currency = await this.currenciesRepository.create();
      currency.name = createCurrencyDto.name;
      currency.createdBy = userId;

      const newCurrency = await this.currenciesRepository.save(currency);
      if (newCurrency) {
        return new BpmResponse(true, newCurrency, null)
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateCurrency(id: string, updateCurrencyDto: CurrencyDto): Promise<BpmResponse> {
    try {

      const currency: Currency = await this.currenciesRepository.findOneBy({ id });
      currency.name = updateCurrencyDto.name;
      const updatedCurrency = await this.currenciesRepository.save(currency)
      if (updatedCurrency) {
        return new BpmResponse(true, updatedCurrency, null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteCurrency(id: string): Promise<BpmResponse> {
    const isDeleted = await this.currenciesRepository.createQueryBuilder()
      .update(Currency)
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