import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BpmResponse } from '..';
import { Role } from './role.entity';
import { RoleDto } from './roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) { }

  async getRoles() {
    try {
      const data = await this.rolesRepository.find({
        where: { active: true },
      });
      return new BpmResponse(true, data, null);
    }
    catch (error: any) {
      console.log(error)
    }
  }

  async findRoleById(id: string) {
    try {
      const data = await this.rolesRepository.findOne({ where: { id, active: true } });
      return new BpmResponse(true, data, null);
    } catch (error: any) {
      console.log(error)
    }
  }

  async createRole(createRoleDto: RoleDto) {
    try {
      const role: Role = await this.rolesRepository.create();
      role.name = createRoleDto.name;

      const newRole = await this.rolesRepository.save(role);
      if (newRole) {
        return new BpmResponse(true, newRole, null)
      }
    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateRole(id: string, updateRoleDto: RoleDto): Promise<BpmResponse> {
    try {

      const role: Role = await this.rolesRepository.findOneBy({ id });
      role.name = updateRoleDto.name;
      const updatedRole = await this.rolesRepository.save(role)
      if (updatedRole) {
        return new BpmResponse(true, updatedRole, null);
      }

    } catch (error: any) {
      console.log(error)
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteRole(id: string): Promise<BpmResponse> {
    const isDeleted = await this.rolesRepository.createQueryBuilder()
      .update(Role)
      .set({ active: false })
      .where("id = :id", { id })
      .execute();
    if (isDeleted.affected) {
      return new BpmResponse(true, 'Successfully updated', null);
    } else {
      return new BpmResponse(true, 'Update failed', null);
    }
  }
}