import { Test, TestingModule } from '@nestjs/testing';
import { BookTransactionRepository } from './book-transaction-repository';

describe('BookTransactionRepository', () => {
  let provider: BookTransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookTransactionRepository],
    }).compile();

    provider = module.get<BookTransactionRepository>(BookTransactionRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
