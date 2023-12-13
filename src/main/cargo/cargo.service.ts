import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse } from '..';
import { Cargo } from './cargo.entity';
import { CargoDto } from './cargo.dto';
import axios from 'axios';
import * as amqp from 'amqplib';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo) private readonly cargoRepository: Repository<Cargo>,
    // private readonly rabbitMQService: RabbitMQService
  ) { }

  connection: any;
  channel: any;

  async getCargos() {
    try {
      const data: any = await this.cargoRepository.find({
        where: { active: true },
        relations: ['createdBy', 'currency', 'cargoType', 'merchant', 'transportType']
      });
      data.forEach((el: any) => {
        el.id = 'M'+el.id;
        el.isMerchant = true;
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async getDriverCargos() {
    try {
      const data: any = await this.cargoRepository.find({
        where: { active: true },
        relations: ['createdBy', 'currency', 'cargoType', 'merchant', 'transportType']
      });
      data.forEach((el: any) => {
        el.id = 'M'+el.id;
        el.isMerchant = true;
        el.driverId = 0;
        el.acceptedOrders = [];
        el.transportTypes = [el.transportType?.code];
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async finishCargo(id: number): Promise<BpmResponse> {
    try {
      // Perform cargo finishing logic
      const cargo = await this.cargoRepository.findOneOrFail({ where: { id } });
      cargo.status = 2;
      await this.cargoRepository.save(cargo);

      return new BpmResponse(true, null, null);
    } catch (error: any) {
      console.error(error);
      throw new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getToken() {
    await axios.post('https://admin.tirgo.io/api/users/login', {phone: '998935421324'})
    const testData = await axios.post('https://admin.tirgo.io/api/users/codeverify', {phone: '998935421324', code: '00000'})
    return testData.data?.token
  }
  

  async getMerchantCargos(id: number) {
    try {
      if(!id) {
        return new BpmResponse(false, null, ['Merchant id is required !']);   
      }
      const token = await this.getToken();
      const testData = await axios.get('https://admin.tirgo.io/api/users/getAcceptedOrdersDriver', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const acceptedOrders = testData.data.data[0]
      let data: any = await this.cargoRepository.find({
        where: { active: true },
        relations: ['createdBy', 'currency', 'cargoType', 'transportType', 'merchant']
      });
      data = data?.filter((el: any) => el.merchant.id == id);
      data.forEach((el: any) => {
        const data = acceptedOrders?.filter((order: any) => order.orderid == el.id);
        el.id = 'M'+el.id;
        el.isMerchant = true;
        el.acceptedOrders = data;
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async findCargoById(id: number) {
    try {
      const data: any = await this.cargoRepository.findOneOrFail({
         where: { id, active: true },
         relations: ['createdBy', 'currency', 'cargoType', 'transportType', 'merchant']
        });
        data.id = 'M'+data.id;
        data.isMerchant = true;
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
      cargo.isSafe = createCargoDto.isSafe || false;
      cargo.createdBy = userId;
      cargo.start_lat = createCargoDto.start_lat;
      cargo.start_lng =  createCargoDto.start_lng;
      cargo.finish_lat =  createCargoDto.finish_lat;
      cargo.finish_lng =  createCargoDto.finish_lng;


      const newCargo = await this.cargoRepository.save(cargo);
      if (newCargo) {
        return new BpmResponse(true, newCargo, null)
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async acceptCargo(createCargoDto: any, userId: string) {
    try {
      // Connect to RabbitMQ
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();

      // Send message to RabbitMQ queue
      await this.channel.assertQueue('acceptDriverOffer');
      await this.channel.sendToQueue('acceptDriverOffer', Buffer.from(JSON.stringify(createCargoDto)));

      // Update cargo status in the database
      console.log(createCargoDto)
      const cargo = await this.cargoRepository.findOneOrFail({ where: { id: createCargoDto.orderId } });
      console.log('Cargo status before update:', cargo.status);

      // Update cargo status
      cargo.status = 1;
      await this.cargoRepository.update({ id: cargo.id }, cargo);

      // Log updated cargo status
      console.log('Cargo status after update:', cargo.status);

      // Close RabbitMQ connection
      await this.connection.close();

      return new BpmResponse(true, null, null);
    } catch (error: any) {
      console.error(error);

      // Close RabbitMQ connection in case of an error
      if (this.connection) {
        await this.connection.close();
      }

      throw new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  async finishMerchantCargo(finishCargoDto: any, userId: string) {
    try {
      // Update cargo status in the database
      console.log(finishCargoDto)
      const cargo = await this.cargoRepository.findOneOrFail({ where: { id: finishCargoDto.orderId } });
      console.log('Cargo status before update:', cargo.status);

      // Update cargo status
      cargo.status = 3;
      await this.cargoRepository.update({ id: cargo.id }, cargo);

      // Log updated cargo status
      console.log('Cargo status after update:', cargo.status);
      const orderId = finishCargoDto.id.toString().split('M')[1] ? finishCargoDto.id.toString().split('M')[1] : finishCargoDto.id
      const token = await this.getToken();
      const testData = await axios.post('https://admin.tirgo.io/api/users/finish-merchant-cargo', { orderId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return new BpmResponse(true, null, null);
    } catch (error: any) {
      console.error(error);

      // Close RabbitMQ connection in case of an error
      if (this.connection) {
        await this.connection.close();
      }

      throw new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCargo(id: number, updateCargoDto: CargoDto): Promise<BpmResponse> {
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
      cargo.isUrgent = updateCargoDto.isSafe || cargo.isSafe;

      const updatedCargo = await this.cargoRepository.save(cargo)
      if (updatedCargo) {
        return new BpmResponse(true, updatedCargo, null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteCargo(id: number): Promise<BpmResponse> {
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