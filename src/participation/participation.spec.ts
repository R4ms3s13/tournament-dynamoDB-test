import { Test, TestingModule } from '@nestjs/testing';
import { Participation } from './participation.repository';

describe('Participation', () => {
  let provider: Participation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Participation],
    }).compile();

    provider = module.get<Participation>(Participation);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
