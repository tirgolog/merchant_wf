import { Body, Controller, Delete, Get, Post, Put, Query, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { CurrencyDto } from "./currency.dto";
import { CurrencyService } from "./currency.service";
import { Request } from "express";

@Controller('api/v1/currency')
export class CurrencyController {
  constructor(
    private currenciesService: CurrencyService
  ) { }

  @Get('id')
  async getById(@Query('id') id: string) {
    return this.currenciesService.findCurrencyById(id);
  }

  @Get('all')
  async getAll() {
    return this.currenciesService.getCurrencies();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createCurrencyDto: CurrencyDto, @Req() req: Request) {
    return this.currenciesService.createCurrency(createCurrencyDto, req['user']?.id);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async update(@Query('id') id: string, @Body() updateCurrencyDto: CurrencyDto) {
    return this.currenciesService.updateCurrency(id, updateCurrencyDto);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.currenciesService.deleteCurrency(id);
  }
}