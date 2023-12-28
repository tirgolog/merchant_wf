// mail.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import rp from 'request-promise';
import { Config } from '../entities/config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SmsService {

  constructor(
    @InjectRepository(Config) private readonly configRepository: Repository<Config>,
  ) {
  }

  async sendSmsGlobal(phone, code, country_code) {
    try {
      const config = await this.configRepository.findOne({});

      let token = config.smsToken;

      const optionsRefresh = {
        method: "PATCH",
        uri: "https://notify.eskiz.uz/api/auth/refresh",
        json: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      
      await rp(optionsRefresh);
      
      const optionsUpdate = {
        method: "POST",
        body: {
          email: "tirgolog@gmail.com",
          password: "G0ZwuvgWNTqesEjqrYzG9CuE4Gc3MFKiUhsppiNh",
        },
        json: true,
        uri: "https://notify.eskiz.uz/api/auth/login",
      };

      const rp_res_update = await rp(optionsUpdate);
      
      if (rp_res_update.data) {
        console.log("refreshTokenSmsEskiz", rp_res_update);
        config.smsToken = rp_res_update.data.token;
        token = rp_res_update.data.token;
        await this.configRepository.update({ id: config.id }, config)

        const options = {
          method: "POST",
          uri: "https://notify.eskiz.uz/api/message/sms/send-global",
          json: true,
          body: {
            mobile_phone: phone,
            message: "Confirmation code " + code,
            country_code: country_code,
          },
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        const rp_res = await rp(options);
        console.log(rp_res);
        return rp_res.status;
      }
    } catch (err) {
      return false;
    } finally {
    }
  }

  async sendSmsLocal(phone, code, country_code) {
    console.log('local sms', phone);
    console.log('local sms', code);
    console.log('local sms', country_code);
    let options = {
      method: "POST",
      uri: "http://91.204.239.44/broker-api/send",
      json: true,
      body: {
        messages: [
          {
            recipient: "" + phone,
            "message-id": "a" + new Date().getTime().toString(),
            sms: {
              originator: "3700",
              content: {
                text: "Confirmation code " + code,
              },
            },
          },
        ],
      },
      headers: {
        Authorization:
          "Basic " + Buffer.from("tirgo:C63Fs89yuN").toString("base64"),
      },
    };
    try {
      let rp_res = await rp(options);
      if (rp_res === "Request is received") {
        return "waiting";
      } else {
        return false;
      }
    } catch (err) {
      return false;
    } finally {
      console.log("finally");
    }
  }
  
}
