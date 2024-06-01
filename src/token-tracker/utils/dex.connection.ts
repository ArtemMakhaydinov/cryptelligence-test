import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class DexConnection {
	private readonly pairsByAddressBaseURL: string;

	constructor() {
		this.pairsByAddressBaseURL = 'https://api.dexscreener.com/latest/dex/tokens/';
	}

	async getUSDLiquidityByAddress(address: string) {
		const JUPPairs = await this.getPairsByAddress(address);
		const liquidityUSD = JUPPairs[0]?.liquidity?.usd;
		return liquidityUSD;
	}

	private async getPairsByAddress(address: string): Promise<any> {
		try {
			const URL = `${this.pairsByAddressBaseURL}${address}`;
			const res = await fetch(URL);
			const { pairs } = await res.json();
			return pairs;
		} catch (err) {
			console.error(err);
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
