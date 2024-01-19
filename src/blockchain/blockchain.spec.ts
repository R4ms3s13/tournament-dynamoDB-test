import { Test, TestingModule } from '@nestjs/testing';
import { Blockchain } from './blockchain.provider';

describe('Blockchain', () => {
  let provider: Blockchain;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Blockchain],
    }).compile();

    provider = module.get<Blockchain>(Blockchain);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
