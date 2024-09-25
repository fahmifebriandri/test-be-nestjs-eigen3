import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Book } from '@prisma/client';
import { BookRepository } from '../book-repository/book-repository';

@ApiTags('books') // Untuk mengelompokkan endpoint di Swagger UI
@Controller('/api/books')
export class BookController {
    constructor(private readonly bookRepository: BookRepository) {}

    // Create a new book
    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'string' },
                title: { type: 'string' },
                author: { type: 'string' },
                stock: { type: 'number' },
            },
        },
    })
    async create(
        @Body('code') code: string,
        @Body('title') title: string,
        @Body('author') author: string,
        @Body('stock') stock: number,
    ): Promise<Book> {
        return this.bookRepository.create(code, title, author, stock);
    }

    // Get all books
    @Get()
    @ApiOperation({ summary: 'Get all books' })
    async findAll(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }

    // Get book by ID
    @Get(':id')
    @ApiOperation({ summary: 'Get a book by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the book', type: 'number' })
    async findById(@Param('id') id: number): Promise<Book | null> {
        return this.bookRepository.findById(Number(id));
    }

    // Update a book by ID
    @Put(':id')
    @ApiOperation({ summary: 'Update a book by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the book to update', type: 'number' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'string' },
                title: { type: 'string' },
                author: { type: 'string' },
                stock: { type: 'number' },
            },
        },
    })
    async update(
        @Param('id') id: number,
        @Body('code') code: string,
        @Body('title') title: string,
        @Body('author') author: string,
        @Body('stock') stock: number,
    ): Promise<Book> {
        return this.bookRepository.update(Number(id), code, title, author, stock);
    }

    // Delete a book by ID
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a book by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the book to delete', type: 'number' })
    async delete(@Param('id') id: number): Promise<Book> {
        return this.bookRepository.delete(Number(id));
    }
}
