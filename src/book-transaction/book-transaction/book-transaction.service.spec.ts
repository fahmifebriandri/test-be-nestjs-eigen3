import { Test, TestingModule } from '@nestjs/testing';
import { BookTransactionService } from './book-transaction.service';

describe('BookTransactionService', () => {
  let service: BookTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookTransactionService],
    }).compile();

    service = module.get<BookTransactionService>(BookTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
