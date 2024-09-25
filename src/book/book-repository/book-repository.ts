import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class BookRepository {
    constructor(private prismaService: PrismaService) { }

    // Create a new book
    async create(code: string, title: string, author: string, stock: number): Promise<Book> {
        return this.prismaService.book.create({
            data: {
                code,
                title,
                author,
                stock,
            },
        });
    }

    // Find all books
    async findAll(): Promise<Book[]> {
        return this.prismaService.book.findMany();
    }

    // Find a book by ID
    async findById(id: number): Promise<Book | null> {
        return this.prismaService.book.findUnique({
            where: { id },
        });
    }

    // Update a book by ID
    async update(id: number, code: string, title: string, author: string, stock: number): Promise<Book> {
        return this.prismaService.book.update({
            where: { id },
            data: {
                code,
                title,
                author,
                stock,
            },
        });
    }

    // Delete a book by ID
    async delete(id: number): Promise<Book> {
        return this.prismaService.book.delete({
            where: { id },
        });
    }
}
