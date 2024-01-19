import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentModule } from './tournament/tournament.module';
import { BlockchainProvider } from './blockchain/blockchain.provider';
import { ParticipationModule } from './participation/participation.module';
import { ConfigModule } from '@nestjs/config'; 
@Module({
  imports: [TournamentModule, ParticipationModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, BlockchainProvider, ParticipationModule],
})
export class AppModule {}
