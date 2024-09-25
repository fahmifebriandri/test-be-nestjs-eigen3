import { Test, TestingModule } from '@nestjs/testing';
import { MemberRepository } from './member-repository';

describe('MemberRepository', () => {
  let provider: MemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberRepository],
    }).compile();

    provider = module.get<MemberRepository>(MemberRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
