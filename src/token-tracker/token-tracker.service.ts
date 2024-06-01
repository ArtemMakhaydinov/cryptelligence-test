import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenInfo } from './dto/token-info.dto';
import { SolanaConnection } from 'src/token-tracker/utils/solana.connection';
import { DexConnection } from 'src/token-tracker/utils/dex.connection';

@Injectable()
export class TokenTrackerService {
	private readonly JUPAddress: string;

	constructor(
		private readonly solanaConnection: SolanaConnection,
		private readonly dexConnection: DexConnection
	) {
		this.JUPAddress = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
	}

	async getJUP(): Promise<any> {
		try {
			const JUPPairs = await this.dexConnection.getPairsByAddress(this.JUPAddress);
			const liquidity = JUPPairs[0].liquidity.usd;
			const tokenInfo = new TokenInfo();
			tokenInfo.liquidity = liquidity;
			return tokenInfo;
		} catch (err) {
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getT(): Promise<any> {
		const parsedTransaction = await this.solanaConnection.getRecentParsedTransaction(this.JUPAddress);
		return parsedTransaction;
	}
}
