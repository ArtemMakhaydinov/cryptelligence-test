import { Injectable } from '@nestjs/common';
import { TokenInfo } from './dto/token-info.dto';
import { ITokenPair } from './token-pair.interface';

@Injectable()
export class TokenTrackerService {
	JUPSymbol: string;
	JUPAddress: string;
	pairsByAddressBaseURL: string;
	constructor() {
		this.JUPSymbol = 'JUP';
		this.JUPAddress = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
		this.pairsByAddressBaseURL = 'https://api.dexscreener.com/latest/dex/tokens/';
	}

	async getJUP(): Promise<any> {
		const JUPPairsURL = `${this.pairsByAddressBaseURL}${this.JUPAddress}`;
		const res = await fetch(JUPPairsURL);
		const pairs = (await res.json()).pairs;
		const liquidity = pairs.reduce((acc: string[], pair: ITokenPair) => {
			acc.push(pair?.liquidity?.usd);
			return acc;
		}, []);
		return liquidity;
	}
}
