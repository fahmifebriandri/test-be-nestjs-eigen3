import { Injectable } from '@nestjs/common';
import { BookTransaction, Member } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class BookTransactionRepository {
  constructor(private prismaService: PrismaService) { }

  async findAll(): Promise<BookTransaction[]> {
    return this.prismaService.bookTransaction.findMany();
  }

  // Cek apakah anggota telah meminjam maksimal 2 buku
  async countBooksBorrowedByMember(member_id: number): Promise<number> {
    return this.prismaService.bookTransaction.count({
      where: { member_id: member_id, status: 'borrowed' },
    });
  }

  // Cek apakah buku tersedia untuk dipinjam
  async isBookAvailable(book_id: number): Promise<boolean> {
    const transaction = await this.prismaService.bookTransaction.findFirst({
      where: { book_id: book_id, status: 'borrowed' },
    });
    return !transaction;
  }

  // Cek apakah anggota sedang dikenakan penalti
  async isMemberUnderPenalty(member_id: number): Promise<boolean> {
    const member = await this.prismaService.member.findUnique({
      where: { id: member_id },
    });
    return member?.is_penalty ?? false;
  }

  async isMemberLastUpdateIsPenalty(member_id: number): Promise<string> {
    const member = await this.prismaService.member.findUnique({
      where: { id: member_id },
    });
    const updatedAt = member.updated_at;
    // Mengembalikan format "YYYY-MM-DD"
    return updatedAt.toISOString().substring(0, 10);
  }

  // Buat transaksi peminjaman buku
  async createTransaction(member_id: number, book_id: number): Promise<BookTransaction> {
    try {
      // Cek jumlah stock buku sebelum membuat transaksi
      const book = await this.prismaService.book.findUnique({
        where: { id: book_id },
        select: { stock: true }, // Hanya ambil field stock
      });

      // Pastikan stock minimal 1
      if (!book || book.stock < 1) {
        throw new Error('Stock not available');
      }

      // Membuat transaksi buku
      const transaction = await this.prismaService.bookTransaction.create({
        data: {
          member_id: member_id,
          book_id: book_id,
        },
      });

      // Mengurangi stock buku setelah transaksi berhasil
      await this.prismaService.book.update({
        where: { id: book_id },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      return transaction; // Mengembalikan transaksi yang telah dibuat
    } catch (error) {
      // Tangani error jika terjadi
      throw new Error(`Transaction creation failed: ${error.message}`);
    }
  }

  // Find books by member_id and status 'borrowed'
  async findTransactionByMemberId(member_id: number): Promise<BookTransaction[] | null> {
    return this.prismaService.bookTransaction.findMany({
      where: {
        member_id: member_id,
        status: 'borrowed',
      },
    });
  }

  // Fungsi untuk mendapatkan transaksi berdasarkan member dan book
  async findTransaction(member_id: number, book_id: number): Promise<BookTransaction | null> {
    return this.prismaService.bookTransaction.findFirst({
      where: {
        member_id,
        book_id,
        status: 'borrowed',
      },
    });
  }

  // Fungsi untuk mengupdate status penalti anggota
  async updateMemberPenalty(member_id: number, penalty: boolean): Promise<Member> {
    return this.prismaService.member.update({
      where: { id: member_id },
      data: { is_penalty: penalty },
    });
  }

  // Fungsi untuk mengupdate transaksi dengan tanggal pengembalian
  async returnBook(transaction_id: number): Promise<BookTransaction> {
    try {
      // Mengambil transaksi berdasarkan ID
      const transaction = await this.prismaService.bookTransaction.findUnique({
        where: { id: transaction_id },
        select: { book_id: true, status: true }, // Ambil book_id dan status
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Cek apakah status sudah 'returned'
      if (transaction.status === 'returned') {
        throw new Error('Book has already been returned');
      }

      // Mengupdate status transaksi dan tanggal pengembalian
      const updatedTransaction = await this.prismaService.bookTransaction.update({
        where: { id: transaction_id },
        data: {
          return_date: new Date(),
          status: 'returned',
        },
      });

      // Mengembalikan stock buku setelah status diupdate
      await this.prismaService.book.update({
        where: { id: transaction.book_id },
        data: {
          stock: {
            increment: 1,
          },
        },
      });

      return updatedTransaction; // Mengembalikan transaksi yang telah diupdate
    } catch (error) {
      // Tangani error jika terjadi
      throw new Error(`Return book failed: ${error.message}`);
    }
  }


}
