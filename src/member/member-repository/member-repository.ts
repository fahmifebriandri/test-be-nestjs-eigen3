import { Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class MemberRepository {
    constructor(private prismaService: PrismaService) {}

    // Create a new member
    async create(code: string, name: string): Promise<Member> {
        return this.prismaService.member.create({
            data: {
                code: code,
                name: name,
            },
        });
    }

    // Read all members
    async findAll(): Promise<Member[]> {
        return this.prismaService.member.findMany();
    }

    // Read member by ID
    async findById(id: number): Promise<Member | null> {
        return this.prismaService.member.findUnique({
            where: { id: id },
        });
    }

    // Update a member by ID
    async update(id: number, code: string, name: string): Promise<Member> {
        return this.prismaService.member.update({
            where: { id: id },
            data: {
                code: code,
                name: name,
            },
        });
    }

    // Delete a member by ID
    async delete(id: number): Promise<Member> {
        return this.prismaService.member.delete({
            where: { id: id },
        });
    }
}
