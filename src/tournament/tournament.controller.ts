import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { CreateParticipationDto } from '../participation/dto/create-participation.dto'
@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post('create')
  @HttpCode(201)
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(createTournamentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.tournamentService.findOne(id);
    if(!data)
      throw new HttpException("Project Not Found",HttpStatus.NOT_FOUND);
    return data;
  }

  @Patch('status/running')
  updateStatusRunning(@Body() updateTournamentDto: UpdateTournamentDto) {
    return this.tournamentService.updateStatusRunning(updateTournamentDto);
  }


}
