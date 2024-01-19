import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentRepository } from './tournament.repository';
import { CreateParticipationDto } from "../participation/dto/create-participation.dto"
import { ParticipationService } from 'src/participation/participation.service';
@Injectable()
export class TournamentService {
  constructor(private readonly tournamentRepository:TournamentRepository){}

  create(createTournamentDto: CreateTournamentDto) {
    return this.tournamentRepository.create(createTournamentDto);
  }

  findOne(id: string) {
    return this.tournamentRepository.findTournamentById(id)
  }

  updateStatusRunning(updateTournamentDto: UpdateTournamentDto) {
    return this.tournamentRepository.updateStatusRunning(updateTournamentDto);
  }

}
