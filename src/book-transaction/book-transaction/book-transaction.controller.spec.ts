import { Test, TestingModule } from '@nestjs/testing';
import { BookTransactionController } from './book-transaction.controller';

describe('BookTransactionController', () => {
  let controller: BookTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookTransactionController],
    }).compile();

    controller = module.get<BookTransactionController>(BookTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
