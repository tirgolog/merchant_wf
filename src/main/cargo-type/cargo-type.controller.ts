import { Body, Controller, Delete, Get, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { CargoTypeDto } from "./cargo-type.dto";
import { CargoTypesService } from "./cargo-type.service";

@Controller('api/v1/cargo-type')
export class CargoTypeController {
  constructor(
    private cargoTypesService: CargoTypesService
  ) { }

  @Get('id')
  async getById(@Query('id') id: string) {
    return this.cargoTypesService.findCargoTypeById(id);
  }

  @Get('all')
  async getAll() {
    return this.cargoTypesService.getCargoTypes();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createCargoTypeDto: CargoTypeDto) {
    return this.cargoTypesService.createCargoType(createCargoTypeDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async update(@Query('id') id: string, @Body() updateCargoTypeDto: CargoTypeDto) {
    return this.cargoTypesService.updateCargoType(id, updateCargoTypeDto);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.cargoTypesService.deleteCargoType(id);
  }
}