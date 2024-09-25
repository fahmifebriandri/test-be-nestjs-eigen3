import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { BookTransactionRepository } from 'src/book-transaction/book-transaction-repository/book-transaction-repository';
import { MemberRepository } from '../member-repository/member-repository';

@ApiTags('members') // Mengelompokkan endpoint di Swagger UI
@Controller('/api/members')
export class MemberController {
    constructor(
        private memberRepository: MemberRepository,
        private bookTransactionRepository: BookTransactionRepository,
    ) {}

    // Create a new member
    @Post('/create')
    @ApiOperation({ summary: 'Create a new member' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'string', description: 'Member code' },
                name: { type: 'string', description: 'Member name' },
            },
        },
    })
    async create(
        @Body('code') code: string,
        @Body('name') name: string
    ): Promise<Member> {
        return this.memberRepository.create(code, name);
    }

    // Get all members
    @Get()
    @ApiOperation({ summary: 'Get all members with their transactions' })
    async findAll(): Promise<any[]> {
        // Mengambil semua anggota dari repository
        const members = await this.memberRepository.findAll();

        // Untuk setiap member, ambil transaksi berdasarkan member_id
        const membersWithTransactions = await Promise.all(
            members.map(async (member) => {
                const transactions = await this.bookTransactionRepository.findTransactionByMemberId(member.id);
                return {
                    ...member, // Menyertakan data member
                    transactions, // Menambahkan data transaksi yang terkait
                };
            })
        );

        // Mengembalikan data member beserta transaksi mereka
        return membersWithTransactions;
    }

    // Get a member by ID
    @Get('/:id')
    @ApiOperation({ summary: 'Get a member by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the member', type: 'number' })
    async findById(@Param('id') id: number): Promise<Member | null> {
        return this.memberRepository.findById(Number(id));
    }

    // Update a member by ID
    @Put('/:id')
    @ApiOperation({ summary: 'Update a member by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the member to update', type: 'number' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'string', description: 'Member code' },
                name: { type: 'string', description: 'Member name' },
            },
        },
    })
    async update(
        @Param('id') id: number,
        @Body('code') code: string,
        @Body('name') name: string
    ): Promise<Member> {
        return this.memberRepository.update(Number(id), code, name);
    }

    // Delete a member by ID
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a member by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the member to delete', type: 'number' })
    async delete(@Param('id') id: number): Promise<Member> {
        return this.memberRepository.delete(Number(id));
    }
}
