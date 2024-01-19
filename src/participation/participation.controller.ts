import { Body, Controller, Post } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';

@Controller('participation')
export class ParticipationController {
    constructor(private readonly participationService: ParticipationService){}
    @Post('/create')
    createParticipation(@Body() participation: CreateParticipationDto){
        return this.participationService.createParticipation(participation);
    }
}
