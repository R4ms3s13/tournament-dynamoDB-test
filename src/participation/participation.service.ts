import { Injectable } from '@nestjs/common';
import { ParticipationRepository } from './participation.repository';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { BlockchainProvider } from 'src/blockchain/blockchain.provider';

@Injectable()
export class ParticipationService {
    constructor(private readonly participationRepository: ParticipationRepository, private readonly blockchainProvider:BlockchainProvider){}

    async createParticipation(participation: CreateParticipationDto){
        const balance = await this.blockchainProvider.getBalanceOf(participation.wallet);
        return await this.participationRepository.create(participation,balance);
    }
}
