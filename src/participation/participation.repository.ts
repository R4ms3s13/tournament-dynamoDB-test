import { DynamoDBClient, AttributeValue, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { CreateParticipationDto } from "./dto/create-participation.dto";
import { TournamentRepository } from "src/tournament/tournament.repository";
import { ParticipationEntity } from "./entity/participation.entity"
import { Status } from "../utils/constants";
@Injectable()
export class ParticipationRepository {
    private readonly tablename: string = "participation";
    private readonly client: DynamoDBClient;

    constructor(private readonly tournamentRepository: TournamentRepository) {
        this.client = new DynamoDBClient({
            region: process.env.AWS_SERVER_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
            }
        });
    }

    async create(participation: CreateParticipationDto, userBalance: number) {
        const tournament = await this.tournamentRepository.findTournamentById(participation.tournamentId);
        if (!tournament || tournament.status != "PENDING")
            throw new HttpException({ status: Status.TournamentUnavailable, reason: "Tournament is not available" }, HttpStatus.BAD_REQUEST);
        const userExistsInTournament = await this.findUserInTournament(participation.tournamentId, participation.userEmail);
        if (userExistsInTournament.participationId)
            throw new HttpException({ status: Status.Fail, reason: "User already in tournament" }, HttpStatus.BAD_REQUEST);

        const cost = userBalance - Number(tournament.accessPrice);
        if (cost < 0)
            throw new HttpException({ status: Status.NotBalance, reason: "User Insufficent Balance", balance: userBalance }, HttpStatus.BAD_REQUEST);

        const itemObject: Record<string, AttributeValue> = {
            participationId: {
                N: String(Date.now()),
            },
            tournamentId: {
                S: participation.tournamentId
            },
            userEmail: {
                S: participation.userEmail
            },
        };
        const command = new PutItemCommand({
            TableName: this.tablename,
            Item: itemObject
        })

        const result = await this.client.send(command);

        return { success: result.$metadata.httpStatusCode == 200, status: Status.Sucess, Balance: cost };

    }

    async findUserInTournament(tournamentId: string, userEmail: string) {
        const command = new ScanCommand({
            TableName: this.tablename,
            FilterExpression: "#tournamentId = :tournamentId and #userEmail = :userEmail",
            ExpressionAttributeNames: {
                "#tournamentId": "tournamentId",
                "#userEmail": "userEmail"
            },
            ExpressionAttributeValues: {
                ':userEmail': {
                    S: userEmail
                },
                ":tournamentId": {
                    S: tournamentId
                }
            }
        });

        const result = await this.client.send(command);
        return ParticipationEntity.newInstanceFromDynamoDB(result.Items[0]);
    }

}