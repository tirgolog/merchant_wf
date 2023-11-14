import { Body, Controller, Delete, Get, Patch, Post, Put, Query, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { TransactionDto } from "./transaction.dto";
import { TransactionService } from "./transaction.service";

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
  async getAllByMerchant(@Query('id') id: string) {
    return this.transactionsService.getTransactionsByMerchant(id);
  }

  @Get('merchant/balance')
  async getBalanceByMerchant(@Query('id') id: string) {
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
  
  @Patch()
  async verify(@Query('id') id: string) {
    return this.transactionsService.verifyTransaction(id);
  }
  
  @Patch()
  async reject(@Query('id') id: string) {
    return this.transactionsService.rejectTransaction(id);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.transactionsService.deleteTransaction(id);
  }
}