import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "src/shared/guards/auth/auth.guard";
import { BpmResponse, ResponseStauses } from "..";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { UsersService } from "./users.service";

@Controller('api/v1/users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { }

    @Get('id')
    async getUserById(@Query('id') id: string) {
      let bpmResponse;
      const user = await this.usersService.findUserById(id);
      if(user) {
        bpmResponse = new BpmResponse(true, user);
      } else {
        bpmResponse = new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return bpmResponse;
    }

    @Get()
    async getUsers() {
      let bpmResponse;
      const list = await this.usersService.getUsers();
      if (list.length) {
         bpmResponse = new BpmResponse(true, list);
      } else {
         bpmResponse = new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return bpmResponse;
    }

    @Get('merchant')
    async getMerchantUsers(@Query() id: string) {
      let bpmResponse;
      const list = await this.usersService.getMerchantUsers(id);
      if (list.length) {
         bpmResponse = new BpmResponse(true, list);
      } else {
         bpmResponse = new BpmResponse(false, null, [ResponseStauses.NotFound]);
      }
      return bpmResponse;
    }

    @Post('')
    @UsePipes(ValidationPipe)
    async createUser(@Body() createUserDto: CreateUserDto) {
      let bpmResponse;
      const user = await this.usersService.createUser(createUserDto);
      if(user) {
        bpmResponse = new BpmResponse(true, user);
      } else {
        bpmResponse = new BpmResponse(false, null, [ResponseStauses.CreateDataFailed]);
      }
      return bpmResponse;
    }

    @Put('')
    @UsePipes(ValidationPipe)
    async updateUser(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      let bpmResponse;
      const isUpdated = await this.usersService.updateUser(id, updateUserDto);
      if(isUpdated) {
        bpmResponse = new BpmResponse(true, [ResponseStauses.SuccessfullyUpdated]);
      } else {
        bpmResponse = new BpmResponse(false, null, [ResponseStauses.UpdateDataFailed]);
      }
      return bpmResponse;
    }

    @Delete('')
    async deleteUser(@Query('id') id: string) {
      let bpmResponse;
      const isDeleted = await this.usersService.deleteUser(id);
      if(isDeleted) {
        bpmResponse = new BpmResponse(true, [ResponseStauses.SuccessfullyDeleted]);
      } else {
        bpmResponse = new BpmResponse(false, null, [ResponseStauses.DeleteDataFailed]);
      }
      return bpmResponse;
    }
}