import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, SendCodeDto, UpdateUserDto, VerifyCodeDto, VerifyPhoneDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { BpmResponse, ResponseStauses } from '..';
import { MailService } from 'src/shared/services/mail.service';
import { SmsService } from 'src/shared/services/sms.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private mailService: MailService,
    private smsService: SmsService
  ) { }

  async getUsers() {
    return (await this.usersRepository.find({ where: { active: true, username: Not('adminuseRname') }, relations: ['role'] })).map((el: any) => {
      return {
        id: el.id,
        fullName: el.fullName,
        username: el.username,
        createdAt: el.createdAt,
        active: el.active,
        disabled: el.disabled,
        lastLogin: el.lastLogin,
        role: { id: el.role.id, name: el.role.name, description: el.role.description }
      }
    });
  }

  async getMerchantUsers(id: number) {
    return (await this.usersRepository.find({ where: { active: true, merchant: id, username: Not('adminuseRname') }, relations: ['role'] })).map((el: any) => {
      return {
        id: el.id,
        fullName: el.fullName,
        username: el.username,
        createdAt: el.createdAt,
        active: el.active,
        disabled: el.disabled,
        lastLogin: el.lastLogin,
        role: { id: el.role.id, name: el.role.name, description: el.role.description }
      }
    });
  }

  findUserById(id: string) {
    return this.usersRepository.findOne({ where: { id, active: true }, relations: ['role'] });
  }

  findUserByIot(id: string) {
    return this.usersRepository.findOne({ where: { id, active: true }, relations: ['role'] });
  }

  findUserByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username, active: true }, relations: ['role', 'merchant'] });
  }

  async createUser(createUserDto: CreateUserDto) {

    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    let createuserObj: User = {
      fullName: createUserDto.fullName,
      username: createUserDto.username,
      phoneNumber: createUserDto.phoneNumber,
      role: createUserDto.role,
      password: passwordHash,
      merchant: createUserDto.merchantId
    }
    const newUser = this.usersRepository.create(createuserObj);
    return this.usersRepository.save(newUser);
  }

  async updateUser(id: string, updates: any): Promise<boolean> {
    const user: User = await this.usersRepository.findOne({ where: { id, active: true } });
    user.fullName = updates.fullName || user.fullName;
    user.username = updates.username || user.username;
    user.phoneNumber = updates.phoneNumber || user.phoneNumber;
    user.role = updates.role || user.role;
    user.lastLogin = updates.lastLogin || user.lastLogin;
    user.password = user.password;
    const updated = await this.usersRepository.save(user);
    return updated ? true : false;
  }

  async deleteUser(id: string): Promise<boolean> {
    const isDeleted = await this.usersRepository.createQueryBuilder()
      .update(User)
      .set({ active: false })
      .where("id = :id", { id })
      .execute();
    return isDeleted.affected ? true : false;
  }

  async changeUserState(id: string): Promise<boolean> {
    const user: User = await this.usersRepository.findOne({ where: { id } })
    if (!user) {
      return false;
    }
    user.disabled = !user.disabled;
    this.usersRepository.save(user);
    return true

  }

  async changeUserPassword(password: string, newPassword: string, id: string) {
    if (!password || !newPassword || !id) {
      return new BpmResponse(false, null, ['All fields are required'])
    }
    const user: User = await this.usersRepository.findOne({ where: { active: true, id } });
    if (!user) {
      return new BpmResponse(false, null, ['User not found']);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return new BpmResponse(false, null, ['Old password is invalid']);
    } else {
      const saltOrRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltOrRounds);
      user.password = passwordHash;
      await this.usersRepository.update({id: user.id}, user);
      return new BpmResponse(true, null, ['Updated'])
    }
  }

  async resetUserPassword(password: string, email: string) {
    if (!password || !email) {
      return new BpmResponse(false, null, ['All fields are required'])
    }
    const user: User = await this.usersRepository.findOne({ where: { active: true, username: email } });
    if (!user) {
      return new BpmResponse(false, null, ['User not found']);
    }
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltOrRounds);
    user.password = passwordHash;
    await this.usersRepository.update({ id: user.id }, user);
    return new BpmResponse(true, null, ['Updated'])
  }

  async sendMailToResetPassword(sendCodeDto: SendCodeDto) {
    const code = await this.generateRoomCode();
    let bpmResponse;
    try {
      const user = await this.usersRepository.findOneOrFail({ where: { username: sendCodeDto.email, active: true } });
      if (user) {
        const info = await this.mailService.sendMail(sendCodeDto.email, 'Verification code', code)
        const timestamp = new Date().getTime(); // Capture the timestamp when the code is generated
        const expirationTime = 3 * 60 * 1000; // 3 minutes in milliseconds
        console.log('Message sent: %s', info.messageId);
        user.resetPasswordCode = code;
        user.resetPasswordCodeSentDate = (timestamp + expirationTime).toString();
        this.usersRepository.update({ id: user.id }, user);
        bpmResponse = new BpmResponse(true, null);
      } else {
        bpmResponse = new BpmResponse(false, null, ['User not found']);
      }
      return bpmResponse;
    } catch (error) {
      console.error('Error sending email:', error);
      return new BpmResponse(false, null, [ResponseStauses.CreateDataFailed]);
    }
  }

  async generateRoomCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  async isCodeValid(date) {
    const currentTimestamp = Date.now();
    return currentTimestamp <= date;
  }

  async verifyResetPasswordCode(verifyCodeDto: VerifyCodeDto) {
    let bpmResponse;
    try {
      const user = await this.usersRepository.findOneOrFail({ where: { username: verifyCodeDto.email, active: true } });
      if (user) {
        if (user.resetPasswordCode == verifyCodeDto.code && await this.isCodeValid(+user.resetPasswordCodeSentDate)) {
          bpmResponse = new BpmResponse(true, null);
          user.resetPasswordCode = null;
          user.resetPasswordCodeSentDate = null;
          this.usersRepository.update({ id: user.id }, user);
        } else {
          bpmResponse = new BpmResponse(false, null, ['Code is Invalid']);
        }
      } else {
        bpmResponse = new BpmResponse(false, null, ['User not found']);
      }
      return bpmResponse;
    } catch (error) {
      console.error('Error sending email:', error);
      return new BpmResponse(false, null, [ResponseStauses.CreateDataFailed]);
    }
  }

  async phoneVerify(verifyPhoneDto: VerifyPhoneDto) {
    let bpmResponse;
    try {
      const user = await this.usersRepository.findOneOrFail({ where: { phoneNumber: verifyPhoneDto.phone, active: true } });
      if (user) {
        const code = this.generateRoomCode()
        const phone = verifyPhoneDto.phone;
        const countryCode = verifyPhoneDto.countryCode;
        if (phone.startsWith('+998') || phone.startsWith('998')) {
          this.smsService.sendSmsLocal(phone, code)
        } else if (phone.startsWith('+77') || phone.startsWith('77')) {
          this.smsService.sendSmsRu(phone, code)
        } else {
          this.smsService.sendSmsGlobal(phone, code, countryCode)
        }
        bpmResponse = new BpmResponse(true, { code });
      } else {
        bpmResponse = new BpmResponse(false, null, ['User not found']);
      }
      return bpmResponse;
    } catch (error) {
      console.error('Error sending email:', error);
      return new BpmResponse(false, null, [ResponseStauses.CreateDataFailed]);
    }
  }

}