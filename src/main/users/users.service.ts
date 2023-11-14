import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { BpmResponse } from '..';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }

  async getUsers() {
    return (await this.usersRepository.find({ where: { active: true }, relations: ['role'] })).map((el: any) => {
      return {
        id: el.id,
        fullName: el.fullName,
        username: el.username,
        createdAt: el.createdAt,
        active: el.active,
        disabled: el.disabled,
        role: { id: el.role.id, name: el.role.name, description: el.role.description }
      }
    });
  }

  async getMerchantUsers(id: string) {
    return (await this.usersRepository.find({ where: { active: true, merchant: id }, relations: ['role'] })).map((el: any) => {
      return {
        id: el.id,
        fullName: el.fullName,
        username: el.username,
        createdAt: el.createdAt,
        active: el.active,
        disabled: el.disabled,
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
      await this.usersRepository.save(user);
      return new BpmResponse(true, null, ['Updated'])
    }
  }
}