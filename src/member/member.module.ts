import { Module } from '@nestjs/common';
import { BookTransactionModule } from 'src/book-transaction/book-transaction.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MemberRepository } from './member-repository/member-repository';
import { MemberController } from './member/member.controller';
import { MemberService } from './member/member.service';

@Module({
  providers: [MemberService, MemberRepository],
  controllers: [MemberController],
  imports: [PrismaModule, BookTransactionModule],
})
export class MemberModule {}
