import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookTransactionModule } from './book-transaction/book-transaction.module';

@Module({
  imports: [PrismaModule, MemberModule, BookModule, BookTransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
