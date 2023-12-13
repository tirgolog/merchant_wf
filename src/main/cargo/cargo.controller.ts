import { Body, Controller, Delete, Get, Post, Put, Req, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { CargosService } from "./cargo.service";
import { AcceptCargoDto, CargoDto } from "./cargo.dto";
import { Request } from "express";

@Controller('api/v1/cargo')
export class CargoController {
  constructor(
    private cargosService: CargosService
  ) { }

  @Get('id')
  async getById(@Query('id') id: number) {
    return this.cargosService.findCargoById(id);
  }

  @Get('all')
  async getAll() {
    return this.cargosService.getCargos();
  }

  @Get('all-driver')
  async getAllDriverCargos() {
    return this.cargosService.getDriverCargos();
  }

  @Get('merchant')
  async getAllMerchant(@Query('id') id: number) {
    return this.cargosService.getMerchantCargos(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createCargoDto: CargoDto, @Req() req: Request) {
    return this.cargosService.createCargo(createCargoDto, req['user']?.id);
  }

  @Post('accept-offer')
  @UsePipes(ValidationPipe)
  async acceptOffer(@Body() acceptCargoDto: AcceptCargoDto, @Req() req: Request) {
    return this.cargosService.acceptCargo(acceptCargoDto, req['user']?.id);
  }

  @Put('finish-cargo')
  @UsePipes(ValidationPipe)
  async finishCargo(@Body() finishCargoDto: any, @Req() req: Request) {
    return this.cargosService.acceptCargo(finishCargoDto, req['user']?.id);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async update(@Query('id') id: number, @Body() updateCargoDto: CargoDto) {
    return this.cargosService.updateCargo(id, updateCargoDto);
  }

  @Delete()
  async delete(@Query('id') id: number) {
    return this.cargosService.deleteCargo(id);
  }
}