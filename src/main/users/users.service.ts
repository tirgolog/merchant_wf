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
      role: createUserDto.role,
      password: passwordHash,
      merchant: createUserDto.merchantId
    }
    if (createUserDto.email) {
      createuserObj.email = createUserDto.email;
    }
    const newUser = this.usersRepository.create(createuserObj);
    return this.usersRepository.save(newUser);
  }

  async updateUser(id: string, updates: any): Promise<boolean> {
    const isUpdated = await this.usersRepository.createQueryBuilder()
      .update(User)
      .set(updates)
      .where("id = :id", { id })
      .execute()
    return isUpdated.affected ? true : false;
  }

  async deleteUser(id: string): Promise<boolean> {
    const isDeleted = await this.usersRepository.createQueryBuilder()
      .update(User)
      .set({ active: false })
      .where("id = :id", { id })
      .execute();
    return isDeleted.affected ? true : false;
  }

  async changeUserPassword(password: string, newPassword: string, id: string) {
    if(!password || !newPassword || !id) {
      return new BpmResponse(false, null, ['All fields are required'])
    }
    const user: User = await this.usersRepository.findOne({ where: { active: true, id } }); 
    if(!user) {
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