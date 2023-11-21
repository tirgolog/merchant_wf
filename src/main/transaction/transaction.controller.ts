import { Body, Controller, Delete, Get, Patch, Post, Put, Query, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { TransactionDto } from "./transaction.dto";
import { TransactionService } from "./transaction.service";
import { Request } from "express";

@Controller('api/v1/transaction')
export class TransactionController {
  constructor(
    private transactionsService: TransactionService
  ) { }

  @Get('id')
  async getById(@Query('id') id: string) {
    return this.transactionsService.findTransactionById(id);
  }

  @Get('all')
  async getAll() {
    return this.transactionsService.getTransactions();
  }

  
  @Get('user')
  async getAllByUser(@Query('id') id: string) {
    return this.transactionsService.getTransactionsByUser(id);
  }

  
  @Get('merchant')
  async getAllByMerchant(@Query('id') id: number) {
    return this.transactionsService.getTransactionsByMerchant(id);
  }

  @Get('merchant/verified')
  async getAllByVerifiedMerchant(@Query('id') id: number) {
    return this.transactionsService.getVerifiedTransactionsByMerchant(id);
  }

  @Get('merchant/rejected')
  async getAllByRejectedMerchant(@Query('id') id: number) {
    return this.transactionsService.getRejetedTransactionsByMerchant(id);
  }

  @Get('merchant/balance')
  async getBalanceByMerchant(@Query('id') id: number) {
    return this.transactionsService.getMerchantBalance(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createTransactionDto: TransactionDto, @Req() req: Request) {
    return this.transactionsService.createTransaction(createTransactionDto, req['user']?.id);
  }

  @Put()
  @UsePipes(ValidationPipe)
  async update(@Query('id') id: string, @Body() updateTransactionDto: TransactionDto) {
    return this.transactionsService.updateTransaction(id, updateTransactionDto);
  }
  
  @Patch('verify')
  async verify(@Query('id') id: string) {
    return this.transactionsService.verifyTransaction(id);
  }
  
  @Patch('reject')
  async reject(@Query('id') id: string) {
    return this.transactionsService.rejectTransaction(id);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.transactionsService.deleteTransaction(id);
  }
}