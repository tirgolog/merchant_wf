import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse } from '..';
import { TransportType } from './transport-type.entity';
import { TransportTypeDto } from './transport-type.dto';

@Injectable()
export class TransportTypesService {
  constructor(
    @InjectRepository(TransportType) private readonly transportTypesRepository: Repository<TransportType>,
  ) { }

  async getTransportTypes() {
    try {
      const data = await this.transportTypesRepository.find({
        where: { active: true },
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async findTransportTypeById(id: string) {
    try {
      const data = await this.transportTypesRepository.findOne({ where: { id, active: true } });
      return new BpmResponse(true, data, null);
    } catch (error: any) {
      console.log(error)
    }
  }

  async createTransportType(createTransportTypeDto: TransportTypeDto) {
    try {
      const role: TransportType = await this.transportTypesRepository.create();
      role.name = createTransportTypeDto.name;

      const newTransportType = await this.transportTypesRepository.save(role);
      if (newTransportType) {
        return new BpmResponse(true, newTransportType, null)
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateTransportType(id: string, updateTransportTypeDto: TransportTypeDto): Promise<BpmResponse> {
    try {

      const role: TransportType = await this.transportTypesRepository.findOneBy({ id });
      role.name = updateTransportTypeDto.name;
      const updatedTransportType = await this.transportTypesRepository.save(role)
      if (updatedTransportType) {
        return new BpmResponse(true, updatedTransportType, null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteTransportType(id: string): Promise<BpmResponse> {
    const isDeleted = await this.transportTypesRepository.createQueryBuilder()
      .update(TransportType)
      .set({ active: false })
      .where("id = :id", { id })
      .execute();
    if (isDeleted.affected) {
      return new BpmResponse(true, 'Successfully deleted', null);
    } else {
      return new BpmResponse(true, 'Delete failed', null);
    }
  }
}