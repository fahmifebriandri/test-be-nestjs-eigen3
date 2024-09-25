import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookTransactionRepository } from './book-transaction-repository/book-transaction-repository';
import { BookTransactionController } from './book-transaction/book-transaction.controller';
import { BookTransactionService } from './book-transaction/book-transaction.service';

@Module({
  controllers: [BookTransactionController],
  providers: [BookTransactionRepository, BookTransactionService],
  exports: [BookTransactionRepository, BookTransactionService],
  imports: [PrismaModule],
})
export class BookTransactionModule { }
