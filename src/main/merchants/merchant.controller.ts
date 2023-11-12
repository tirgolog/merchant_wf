import { Body, Controller, Delete, Get, Patch, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { MerchantDto } from "./merchant.dto";
import { MerchantService } from "./merchant.service";

@Controller('api/v1/merchant')
export class MerchantController {
  constructor(
    private merchantsService: MerchantService
  ) { }

  @Get('id')
  async getById(@Query('id') id: string) {
    return this.merchantsService.findMerchantById(id);
  }

  @Get('all')
  async getAll() {
    return this.merchantsService.getMerchants();
  }

  @Get('verified')
  async getAllVerified() {
    return this.merchantsService.getVerifiedMerchants();
  }

  @Get('unverified')
  async getAllUnverified() {
    return this.merchantsService.getUnverifiedMerchants();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createMerchantDto: MerchantDto) {
     return this.merchantsService.createMerchant(createMerchantDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async update(@Query('id') id: string, @Body() updateMerchantDto: MerchantDto) {
    return this.merchantsService.updateMerchant(id, updateMerchantDto);
  }

  @Patch('/verify')
  @UsePipes(ValidationPipe)
  async verify(@Query('id') id: string) {
    return this.merchantsService.verifyMerchant(id);
  }

  @Patch('/reject')
  @UsePipes(ValidationPipe)
  async reject(@Query('id') id: string) {
    return this.merchantsService.rejectMerchant(id);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.merchantsService.deleteMerchant(id);
  }
}