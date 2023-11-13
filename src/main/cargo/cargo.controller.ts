import { Body, Controller, Delete, Get, Post, Put, Req, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { CargosService } from "./cargo.service";
import { CargoDto } from "./cargo.dto";

@Controller('api/v1/cargo')
export class CargoController {
  constructor(
    private cargosService: CargosService
  ) { }

  @Get('id')
  async getById(@Query('id') id: string) {
    return this.cargosService.findCargoById(id);
  }

  @Get('all')
  async getAll() {
    return this.cargosService.getCargos();
  }

  @Get('merchant')
  async getAllMerchant(@Query('id') id: string) {
    return this.cargosService.getMerchantCargos(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createCargoDto: CargoDto, @Req() req: Request) {
    return this.cargosService.createCargo(createCargoDto, req['user']?.id);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async update(@Query('id') id: string, @Body() updateCargoDto: CargoDto) {
    return this.cargosService.updateCargo(id, updateCargoDto);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.cargosService.deleteCargo(id);
  }
}