import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BookTransaction } from '@prisma/client';
import { BookTransactionRepository } from '../book-transaction-repository/book-transaction-repository';
import { BookTransactionService } from './book-transaction.service';

@ApiTags('book-transactions') // Mengelompokkan endpoint dalam Swagger UI
@Controller('/api/book-transactions')
export class BookTransactionController {
    constructor(
        private readonly bookTransactionService: BookTransactionService,
        private readonly bookTransactionRepository: BookTransactionRepository
    ) { }

    // Mendapatkan semua riwayat transaksi
    @Get()
    @ApiOperation({ summary: 'Get all book transaction history' })
    async historyTransaction(): Promise<BookTransaction[]> {
        return this.bookTransactionRepository.findAll();
    }

    // Peminjaman Buku
    @Post('/borrow')
    @ApiOperation({ summary: 'Borrow a book' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                member_id: { type: 'string', description: 'ID of the member borrowing the book' },
                book_id: { type: 'string', description: 'ID of the book to be borrowed' },
            },
        },
    })
    async borrowBook(
        @Body('member_id') member_id: string,
        @Body('book_id') book_id: string
    ) {
        const memberIdNumber = Number(member_id);
        const bookIdNumber = Number(book_id);

        // Validasi input
        if (isNaN(memberIdNumber)) {
            throw new BadRequestException('member_id harus berupa angka.');
        }
        if (isNaN(bookIdNumber)) {
            throw new BadRequestException('book_id harus berupa angka.');
        }

        return this.bookTransactionService.borrowBook(memberIdNumber, bookIdNumber);
    }

    // Pengembalian Buku
    @Post('/return/:transaction_id')
    @ApiOperation({ summary: 'Return a borrowed book' })
    @ApiParam({ name: 'transaction_id', required: true, description: 'ID of the transaction for returning the book', type: 'string' })
    async returnBook(@Param('transaction_id') transaction_id: string) {
        const transactionIdNumber = Number(transaction_id);

        // Validasi input
        if (isNaN(transactionIdNumber)) {
            throw new BadRequestException('transaction_id harus berupa angka.');
        }

        return this.bookTransactionService.returnBook(transactionIdNumber);
    }
}
