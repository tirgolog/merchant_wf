import { Body, Controller, Delete, Get, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { RoleDto } from "./roles.dto";
import { RolesService } from "./role.service";

@Controller('api/v1/role')
export class RoleController {
  constructor(
    private rolesService: RolesService
  ) { }

  @Get('id')
  async getById(@Query('id') id: string) {
    return this.rolesService.findRoleById(id);
  }

  @Get('all')
  async getAll() {
    return this.rolesService.getRoles();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createRoleDto: RoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async update(@Query('id') id: string, @Body() updateRoleDto: RoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.rolesService.deleteRole(id);
  }
}