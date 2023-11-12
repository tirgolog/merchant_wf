import { Body, Controller, Delete, Get, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { TransportTypeDto } from "./transport-type.dto";
import { TransportTypesService } from "./transport-type.service";

@Controller('api/v1/transport-type')
export class TransportTypeController {
  constructor(
    private transportTypesService: TransportTypesService
  ) { }

  @Get('id')
  async getById(@Query('id') id: string) {
    return this.transportTypesService.findTransportTypeById(id);
  }

  @Get('all')
  async getAll() {
    return this.transportTypesService.getTransportTypes();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createTransportTypeDto: TransportTypeDto) {
    return this.transportTypesService.createTransportType(createTransportTypeDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async update(@Query('id') id: string, @Body() updateTransportTypeDto: TransportTypeDto) {
    return this.transportTypesService.updateTransportType(id, updateTransportTypeDto);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.transportTypesService.deleteTransportType(id);
  }
}