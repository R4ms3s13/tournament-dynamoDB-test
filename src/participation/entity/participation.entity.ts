export class ParticipationEntity{
    participationId:string;
    tournamentId:string;
    userEmail:string;


    static newInstanceFromDynamoDB(item){
        const result = new ParticipationEntity();
        result.participationId = item?.participationId.N;
        result.tournamentId = item?.tournamentId.S;
        result.userEmail = item?.userEmail.S;
        return result;
    }
    
}