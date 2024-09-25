import { Test, TestingModule } from '@nestjs/testing';
import { BookRepository } from './book-repository';

describe('BookRepository', () => {
  let provider: BookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookRepository],
    }).compile();

    provider = module.get<BookRepository>(BookRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
