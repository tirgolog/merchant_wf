import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse } from '..';
import { Cargo } from './cargo.entity';
import { CargoDto } from './cargo.dto';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo) private readonly cargoRepository: Repository<Cargo>,
  ) { }

  async getCargos() {
    try {
      const data = await this.cargoRepository.find({
        where: { active: true },
        relations: ['createdBy', 'currency', 'cargoType', 'transportType']
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async getMerchantCargos(id: string) {
    try {
      if(!id) {
        return new BpmResponse(false, null, ['Merchant id is required !']);   
      }
      let data: any = await this.cargoRepository.find({
        where: { active: true },
        relations: ['createdBy', 'currency', 'cargoType', 'transportType', 'merchant']
      });
      data = data.filter((el: any) => el.merchant.id == id);
 
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async findCargoById(id: string) {
    try {
      const data = await this.cargoRepository.findOne({
         where: { id, active: true },
         relations: ['createdBy', 'currency', 'cargoType', 'transportType']
        });
      return new BpmResponse(true, data, null);
    } catch (error: any) {
      console.log(error)
    }
  }

  async createCargo(createCargoDto: CargoDto, userId: string) {
    try {
      const cargo: Cargo = new Cargo();
      cargo.sendLocation = createCargoDto.sendLocation;
      cargo.cargoDeliveryLocation = createCargoDto.cargoDeliveryLocation || null;
      cargo.transportType = createCargoDto.transportTypeId;
      cargo.cargoType = createCargoDto.cargoTypeId;
      cargo.sendCargoDate = createCargoDto.sendCargoDate;
      cargo.sendCargoTime = createCargoDto.sendCargoTime;
      cargo.merchant = createCargoDto.merchantId;
      cargo.currency = createCargoDto.currencyId || null;
      cargo.offeredPrice = createCargoDto.offeredPrice || null;
      cargo.cargoWeight = createCargoDto.cargoWeight || null;
      cargo.cargoLength = createCargoDto.cargoLength || null;
      cargo.cargoWidth = createCargoDto.cargoWidth || null;
      cargo.cargoHeight = createCargoDto.cargoHeight || null;
      cargo.isDangrousCargo = createCargoDto.isDangrousCargo || null;
      cargo.isCashlessPayment = createCargoDto.isCashlessPayment || null;
      cargo.isUrgent = createCargoDto.isUrgent || null;
      cargo.createdBy = userId;


      const newCargo = await this.cargoRepository.save(cargo);
      if (newCargo) {
        return new BpmResponse(true, newCargo, null)
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateCargo(id: string, updateCargoDto: CargoDto): Promise<BpmResponse> {
    try {

      const cargo: Cargo = await this.cargoRepository.findOneBy({ id, active: true });
      if(!cargo) {
        return new BpmResponse(false, null, ['Cargo not found']);
      }
      cargo.sendLocation = updateCargoDto.sendLocation;
      cargo.cargoDeliveryLocation = updateCargoDto.cargoDeliveryLocation || null;
      cargo.transportType = updateCargoDto.transportTypeId;
      cargo.cargoType = updateCargoDto.cargoTypeId;
      cargo.sendCargoDate = updateCargoDto.sendCargoDate;
      cargo.sendCargoTime = updateCargoDto.sendCargoTime;
      cargo.currency = updateCargoDto.currencyId || cargo.currency;
      cargo.offeredPrice = updateCargoDto.offeredPrice || cargo.offeredPrice;
      cargo.cargoWeight = updateCargoDto.cargoWeight || cargo.cargoWeight;
      cargo.cargoLength = updateCargoDto.cargoLength || cargo.cargoLength;
      cargo.cargoWidth = updateCargoDto.cargoWidth || cargo.cargoWidth;
      cargo.cargoHeight = updateCargoDto.cargoHeight || cargo.cargoHeight;
      cargo.isDangrousCargo = updateCargoDto.isDangrousCargo || cargo.isDangrousCargo;
      cargo.isCashlessPayment = updateCargoDto.isCashlessPayment || cargo.isCashlessPayment;
      cargo.isUrgent = updateCargoDto.isUrgent || cargo.isUrgent;

      const updatedCargo = await this.cargoRepository.save(cargo)
      if (updatedCargo) {
        return new BpmResponse(true, updatedCargo, null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteCargo(id: string): Promise<BpmResponse> {
    if(!id) {
      return new BpmResponse(false, null, ['Id is required !']);   
    }
    const isDeleted = await this.cargoRepository.createQueryBuilder()
      .update(Cargo)
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