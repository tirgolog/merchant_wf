import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse } from '..';
import { CargoType } from './cargo-type.entity';
import { CargoTypeDto } from './cargo-type.dto';

@Injectable()
export class CargoTypesService {
  constructor(
    @InjectRepository(CargoType) private readonly cargoTypesRepository: Repository<CargoType>,
  ) { }

  async getCargoTypes() {
    try {
      const data = await this.cargoTypesRepository.find({
        where: { active: true },
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async findCargoTypeById(id: string) {
    try {
      const data = await this.cargoTypesRepository.findOne({ where: { id, active: true } });
      return new BpmResponse(true, data, null);
    } catch (error: any) {
      console.log(error)
    }
  }

  async createCargoType(createCargoTypeDto: CargoTypeDto) {
    try {
      const role: CargoType = await this.cargoTypesRepository.create();
      role.name = createCargoTypeDto.name;
      role.code = createCargoTypeDto.code;

      const newCargoType = await this.cargoTypesRepository.save(role);
      if (newCargoType) {
        return new BpmResponse(true, newCargoType, null)
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateCargoType(id: string, updateCargoTypeDto: CargoTypeDto): Promise<BpmResponse> {
    try {

      const role: CargoType = await this.cargoTypesRepository.findOneBy({ id });
      role.name = updateCargoTypeDto.name;
      const updatedCargoType = await this.cargoTypesRepository.save(role)
      if (updatedCargoType) {
        return new BpmResponse(true, updatedCargoType, null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteCargoType(id: string): Promise<BpmResponse> {
    const isDeleted = await this.cargoTypesRepository.createQueryBuilder()
      .update(CargoType)
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