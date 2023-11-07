import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
      ) {}

      async getUsers() {
        return (await this.usersRepository.find()).map((el: any) => {
          return {
            id: el.id,
            firstname: el.firstname,
            lastname: el.lastname,
            username: el.username,
            createdAt: el.createdAt,
            active: el.active
          }
        });
      }
          
      findUserById(id: string) {
        return this.usersRepository.findOne({ where: { id }} );
      }

      findUserByUsername(username: string) {
        return this.usersRepository.findOne({ where: { username }} );
      }

     async createUser(createUserDto: CreateUserDto) {

        const saltOrRounds = 10;
        const passwordHash = await bcrypt.hash(createUserDto.password, saltOrRounds);
        let createuserObj: CreateUserDto = {
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname,
          username: createUserDto.username,
          role: createUserDto.role,
          password: passwordHash
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
        .set({active: false})
        .where("id = :id", { id })
        .execute();
        return isDeleted.affected ? true : false;
     }
}