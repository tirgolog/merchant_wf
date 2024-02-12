import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { BpmResponse, Transaction, TransportType } from '..';
import { Cargo } from './cargo.entity';
import { CargoDto } from './cargo.dto';
import axios from 'axios';
import * as amqp from 'amqplib';
import { SseGateway } from 'src/shared/gateway/sse.gateway';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo) private readonly cargoRepository: Repository<Cargo>,
    @InjectRepository(TransportType) private readonly transportTypesRepository: Repository<TransportType>,
    @InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>,
    private eventsServcie: SseGateway
    // private readonly rabbitMQService: RabbitMQService
  ) { }

  connection: any;
  channel: any;

  async getCargos() {
    try {
      const data: any = await this.cargoRepository.find({
        where: { active: true, status: Not(4) },
        relations: ['createdBy', 'currency', 'cargoType', 'merchant']
      });
      for (let item of data) {
        const transportTypes = await this.transportTypesRepository.find({ where: { id: In(item.transportTypes) } })
        item.id = 'M' + item.id;
        item.isMerchant = true;
        item.transportTypes = transportTypes.map((el: any) => +el.code);
      }
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async getDriverCargos(secure: boolean) {
    try {
      const isSafe = secure == true ? !!secure : false;
      let filter: any = {};
      if (isSafe) {
        filter = { active: true, isSafe, status: Not(4) }
      } else {
        filter = { active: true, status: Not(4) }
      }
      const data: any = await this.cargoRepository.find({
        where: filter,
        relations: ['createdBy', 'currency', 'cargoType', 'merchant'],
        order: { id: "DESC" }
      });
      for (let item of data) {
        const transportTypes = await this.transportTypesRepository.find({ where: { id: In(item.transportTypes) } })
        item.id = 'M' + item.id;
        item.isMerchant = true;
        item.driverId = 0;
        item.acceptedOrders = [];
        item.transportTypes = transportTypes.map((el: any) => +el.code);
      }
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async getAdminCargos(secure: boolean) {
    try {
      const isSafe = secure == true ? !!secure : false;
      let filter: any = {};
      if (isSafe) {
        filter = { active: true, isSafe }
      } else {
        filter = { active: true }
      }
      const data: any = await this.cargoRepository.find({
        where: filter,
        relations: ['createdBy', 'currency', 'cargoType', 'merchant'],
        order: { id: "DESC" }
      });
      for (let item of data) {
        const transportTypes = await this.transportTypesRepository.find({ where: { id: In(item.transportTypes) } })
        item.id = 'M' + item.id;
        item.isMerchant = true;
        item.driverId = 0;
        item.acceptedOrders = [];
        item.transportTypes = transportTypes.map((el: any) => +el.code);
      }
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
      console.log('cargo before finish', cargo)
      cargo.status = 2;
      const res = await this.cargoRepository.save(cargo);
      console.log('cargo after finish', res)
      return new BpmResponse(true, null, null);
    } catch (error: any) {
      console.error(error);
      throw new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async appendCargo(id: number): Promise<BpmResponse> {
    try {
      // Perform cargo finishing logic
      console.log('Append cargo: ', id)
      const cargo = await this.cargoRepository.findOneOrFail({ where: { id } });
      cargo.status = 1;
      await this.cargoRepository.save(cargo);

      return new BpmResponse(true, null, null);
    } catch (error: any) {
      console.error(error);
      throw new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async cancelCargo(id: number) {
    try {
      // Perform cargo finishing logic
      console.log('Cancel cargo: ', id)
      const cargo = await this.cargoRepository.findOneOrFail({ where: { id } });
      cargo.status = 4;
      await this.cargoRepository.save(cargo);

      return true;
    } catch (error: any) {
      console.error(error);
      throw new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getToken() {
    await axios.post('https://admin.tirgo.io/api/users/login', { phone: '998935421324' })
    const testData = await axios.post('https://admin.tirgo.io/api/users/codeverify', { phone: '998935421324', code: '00000' })
    return testData.data?.token
  }

  async findCity(body: any) {
    const token = await this.getToken();
    const testData = await axios.post('https://admin.tirgo.io/api/users/findCity', { query: body.query }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return new BpmResponse(true, testData.data.data, null);
  }


  async getMerchantCargos(id: number) {
    try {
      if (!id) {
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
        where: { active: true, status: Not(4) },
        relations: ['createdBy', 'currency', 'cargoType', 'merchant'],
        order: { id: "DESC" }
      });
      data = data?.filter((el: any) => el.merchant.id == id);
      for (let item of data) {
        const data = acceptedOrders?.filter((order: any) => order.orderid == item.id);
        const transportTypes = await this.transportTypesRepository.find({ where: { id: In(item.transportTypes) } })
        item.id = 'M' + item.id;
        item.isMerchant = true;
        item.acceptedOrders = data;
        item.transportTypes = transportTypes;
      };
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
        relations: ['createdBy', 'currency', 'cargoType', 'merchant']
      });
      const transportTypes = await this.transportTypesRepository.find({ where: { id: In(data.transportTypes) } })
      data.id = 'M' + data.id;
      data.isMerchant = true;
      data.transportTypes = transportTypes.map((el: any) => el.code)
      return new BpmResponse(true, data, null);
    } catch (error: any) {
      console.log(error)
    }
  }

  async createCargo(createCargoDto: CargoDto, userId: string) {
    try {
      // const transportTypes = await this.transportTypesRepository.find({ where: { id: In(createCargoDto.transportTypeIds) } });

      const cargo: Cargo = new Cargo();
      cargo.sendLocation = createCargoDto.sendLocation;
      cargo.cargoDeliveryLocation = createCargoDto.cargoDeliveryLocation || null;
      cargo.transportTypes = createCargoDto.transportTypeIds;
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
      cargo.start_lng = createCargoDto.start_lng;
      cargo.finish_lat = createCargoDto.finish_lat;
      cargo.finish_lng = createCargoDto.finish_lng;


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
      this.connection = await amqp.connect("amqp://13.232.83.179:5672");
      this.channel = await this.connection.createChannel();

      if (!createCargoDto.clientId) {
        return new BpmResponse(false, null, ['Merchant is required']);
      }
      let topup = await this.transactionsRepository.find({ where: { active: true, transactionType: 'topup', verified: true }, relations: ['merchant'] });
      topup = topup.filter((el: any) => el.merchant?.id == createCargoDto.clientId)
      let withdrow = await this.transactionsRepository.find({ where: { active: true, transactionType: 'withdrow', verified: true }, relations: ['merchant'] });
      withdrow = withdrow.filter((el: any) => el.merchant?.id == createCargoDto.clientId)

      const topupBalance = topup.reduce((a: any, b: any) => a + b.amount, 0);
      const withdrowBalance = withdrow.reduce((a: any, b: any) => a + b.amount, 0);
      const token = await this.getToken();
      const testData = await axios.get('https://admin.tirgo.io/api/users/getMerchantBalance?clientId=' + createCargoDto.clientId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = testData.data.data;
      const balance = (((topupBalance - withdrowBalance) - data.totalFrozenAmount) - data.totalRemovalAmount);



      if(createCargoDto.amount > balance) {
        return new BpmResponse(false, null, ['notEnoughBalance'])
      }

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
      // await this.connection.close();
      this.eventsServcie.sendUpdateBalance('1')
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
      const orderId = finishCargoDto.orderId.toString().split('M')[1] ? finishCargoDto.orderId.toString().split('M')[1] : finishCargoDto.orderId;
      const cargo = await this.cargoRepository.findOneOrFail({ where: { id: orderId } });
      console.log('Cargo status before update:', cargo.status);


      // Log updated cargo status
      console.log('Cargo status after update:', cargo.status);
      const token = await this.getToken();
      const testData = await axios.post('https://admin.tirgo.io/api/users/finish-merchant-cargo', { orderId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (testData.data?.status) {
        // Update cargo status
        cargo.status = 3;
        await this.cargoRepository.update({ id: cargo.id }, cargo);
      }

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
      if (!cargo) {
        return new BpmResponse(false, null, ['Cargo not found']);
      }
      // const transportTypes = await this.transportTypesRepository.find({ where: { id: In(updateCargoDto.transportTypeIds) } });
      cargo.sendLocation = updateCargoDto.sendLocation;
      cargo.cargoDeliveryLocation = updateCargoDto.cargoDeliveryLocation || null;
      cargo.transportTypes = updateCargoDto.transportTypeIds;
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
    if (!id) {
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