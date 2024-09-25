import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookRepository } from './book-repository/book-repository';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';

@Module({
  providers: [BookService, BookRepository],
  controllers: [BookController],
  imports: [PrismaModule],
})
export class BookModule {}
