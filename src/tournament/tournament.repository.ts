import { GetItemCommand, DynamoDBClient, AttributeValue, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Tournament } from "./entities/tournament.entity";
import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { HttpException } from "@nestjs/common";
import { UpdateTournamentDto } from "./dto/update-tournament.dto";

@Injectable()
export class TournamentRepository {
    private readonly tablename: string = "tournament";
    private readonly client: DynamoDBClient;

    constructor() {
        this.client = new DynamoDBClient({
            region: process.env.AWS_SERVER_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
            }
        });
    }

    async findTournamentById(id: string) {
        const command = new GetItemCommand({
            TableName: this.tablename,
            Key: {
                tournamentId: {
                    S: id
                }
            }
        });

        const result = await this.client.send(command);
        if (result.Item) {
            return Tournament.newInstanceFromDynamoDB(result.Item);
        }
    }

    async create(tournament: CreateTournamentDto) {
        const exists = await this.findTournamentById(tournament.tournamentId);
        if (exists)
            throw new HttpException({ success: false, reason: "Tournament already exists" }, HttpStatus.BAD_REQUEST);
        const rewards = {}
        for (const [k, v] of Object.entries(tournament.rewardsByRanking)) {
            rewards[k] = {
                N: String(v)
            }
        }
        const itemObject: Record<string, AttributeValue> = {
            tournamentId: {
                S: tournament.tournamentId,
            },
            accessPrice: {
                N: String(tournament.accessPrice)
            },
            createdAt: {
                N: String(Date.now())
            },
            rewardsByRanking: {
                M: rewards
            },
            tournamentStatus: {
                S: "PENDING"
            }
        };
        const command = new PutItemCommand({
            TableName: this.tablename,
            Item: itemObject
        })

        const result = await this.client.send(command);

        return { success: result.$metadata.httpStatusCode == 200 };
    }

    async updateStatusRunning(tournament: UpdateTournamentDto) {
        const tournamentExists = await this.findTournamentById(tournament.tournamentId)
        if(!tournamentExists)
            throw new HttpException({success:false,reason:"Tournament do not exists"},HttpStatus.BAD_REQUEST)
        if(tournamentExists.status !== "PENDING")
            throw new HttpException({success:false,reason:"Tournament must be Pending"},HttpStatus.BAD_REQUEST)
        const command = new UpdateItemCommand({
            TableName: this.tablename,
            Key: {
                tournamentId: {
                    S: tournament.tournamentId
                }
            }, UpdateExpression: 'set tournamentStatus = :tournamentstatus',
            ExpressionAttributeValues: {
                ':tournamentstatus': { S: 'RUNNING'}
            }
        })

        const result = await this.client.send(command);
        return { success: result.$metadata.httpStatusCode == 200 };
    }

}