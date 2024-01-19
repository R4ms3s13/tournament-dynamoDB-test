export class Tournament {
    tournamentId: string;
    accessPrice:number;
    // serialized Map;
    rewardsByRanking:string;
    createdAt:Date;
    status:string;


static newInstanceFromDynamoDB(item){
    const result = new Tournament();
    result.tournamentId = item.tournamentId.S;
    result.accessPrice = item?.accessPrice.N;
    result.rewardsByRanking = item?.rewardsByRanking.M;
    result.createdAt = new Date(Number(item?.createdAt.N));
    result.status = item?.tournamentStatus.S;
    return result;
}

}
