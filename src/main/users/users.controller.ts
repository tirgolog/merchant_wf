import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "src/shared/guards/auth/auth.guard";
import { BpmResponse, ResponseStauses } from "..";
import { CreateUserDto, SendCodeDto, UpdateUserDto, VerifyCodeDto, VerifyPhoneDto } from "./users.dto";
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
    async getMerchantUsers(@Query() id: number) {
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

    @Post('send-code')
    @UsePipes(ValidationPipe)
    async sendCode(@Body() sendCodeDto: SendCodeDto) {
      return this.usersService.sendMailToResetPassword(sendCodeDto);
    }

    @Post('verify-code')
    @UsePipes(ValidationPipe)
    async verifyCode(@Body() sendCodeDto: VerifyCodeDto) {
      return this.usersService.verifyResetPasswordCode(sendCodeDto);
    }

    @Post('phone-verify')
    @UsePipes(ValidationPipe)
    async phoneVerify(@Body() sendPhoneVerifyDto: VerifyPhoneDto) {
      return this.usersService.phoneVerify(sendPhoneVerifyDto);
    }

    @Patch('password')
    @UsePipes(ValidationPipe)
    async changePass(@Query('id') id: string, @Body() body: { password: string, newPassword: string }) {
      return this.usersService.changeUserPassword(body.password, body.newPassword, id);
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

    @Patch('state')
    @UsePipes(ValidationPipe)
    async disableUser(@Query('id') id: string) {
      let bpmResponse;
      const isUpdated = await this.usersService.changeUserState(id);
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