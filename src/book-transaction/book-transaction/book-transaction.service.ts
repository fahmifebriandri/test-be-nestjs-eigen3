import { BadRequestException, Injectable } from '@nestjs/common';
import { differenceInDays } from 'date-fns'; // Pastikan menggunakan library date-fns atau library lain untuk menghitung perbedaan tanggal
import { BookTransactionRepository } from '../book-transaction-repository/book-transaction-repository';


@Injectable()
export class BookTransactionService {
    constructor(private readonly bookTransactionRepository: BookTransactionRepository) { }

    // Peminjaman Buku
    async borrowBook(member_id: number, book_id: number) {
        // Cek penalti
        const isPenalized = await this.bookTransactionRepository.isMemberUnderPenalty(member_id);
        const penalizedDate = await this.bookTransactionRepository.isMemberLastUpdateIsPenalty(member_id); // Mengembalikan format "YYYY-MM-DD"

        if (isPenalized) {
            const today = new Date();
            const penalizedStartDate = new Date(penalizedDate);

            // Hitung selisih hari
            const penaltyDuration = differenceInDays(today, penalizedStartDate);

            if (penaltyDuration <= 3) {
                throw new BadRequestException(`Anggota sedang dikenakan penalti selama 3 hari mulai dari : ${penalizedDate}`);
            }else{
                await this.bookTransactionRepository.updateMemberPenalty(member_id, false);
            }
        }

        // Cek jumlah buku yang sedang dipinjam
        const booksBorrowed = await this.bookTransactionRepository.countBooksBorrowedByMember(member_id);
        if (booksBorrowed >= 2) {
            throw new BadRequestException('Anggota tidak boleh meminjam lebih dari 2 buku.');
        }

        // Cek apakah buku tersedia
        const isBookAvailable = await this.bookTransactionRepository.isBookAvailable(book_id);
        if (!isBookAvailable) {
            throw new BadRequestException('Buku ini sedang dipinjam oleh anggota lain.');
        }

        // Buat transaksi peminjaman
        return this.bookTransactionRepository.createTransaction(member_id, book_id);
    }


    async returnBook(transaction_id: number) {
        const transaction = await this.bookTransactionRepository.returnBook(transaction_id);
        if (!transaction) {
            throw new BadRequestException('Transaksi tidak ditemukan.');
        }

        const now = new Date();
        const borrowDate = transaction.borrow_date;
        const diffTime = Math.abs(now.getTime() - borrowDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Cek jika pengembalian lebih dari 7 hari
        if (diffDays > 7) {
            await this.bookTransactionRepository.updateMemberPenalty(transaction.member_id, true);
        }

        return transaction;
    }

}
