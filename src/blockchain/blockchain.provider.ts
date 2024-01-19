import { Get, Injectable } from '@nestjs/common';
import { ethers, JsonRpcProvider, Contract } from "ethers";
import {abi} from "./contract_abi.json"

@Injectable()
export class BlockchainProvider {
    customHttpProvider:JsonRpcProvider;
    tokenContract:Contract;
    contractJsonInfo:any;
    contractAddress:string; 
    constructor(){ 
		this.contractJsonInfo = abi;
        this.customHttpProvider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER);
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        this.tokenContract = new ethers.Contract(this.contractAddress, this.contractJsonInfo, this.customHttpProvider);
    }
    private GetContract () {
		try {
			if (!this.customHttpProvider) {
				this.customHttpProvider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER);
			}
			if (!this.tokenContract) {
				this.tokenContract = new ethers.Contract(this.contractAddress, this.contractJsonInfo, this.customHttpProvider);
			} 
			return this.tokenContract;
		} catch (e) {
			console.log(e);
		}
	}

	async getBalanceOf(wallet:string){
		const balance = await this.GetContract().balanceOf(wallet)
		return Number(ethers.formatUnits(balance,18));
	}
}
