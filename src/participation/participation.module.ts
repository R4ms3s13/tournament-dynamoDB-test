import { Module } from '@nestjs/common';
import { ParticipationRepository } from './participation.repository';
import { TournamentModule } from 'src/tournament/tournament.module';
import { ParticipationService } from './participation.service';
import { BlockchainProvider } from 'src/blockchain/blockchain.provider';
import { ParticipationController } from './participation.controller';
@Module({
  providers: [ParticipationRepository, ParticipationService, BlockchainProvider],
  imports: [TournamentModule],
  controllers: [ParticipationController]
})
export class ParticipationModule {}

