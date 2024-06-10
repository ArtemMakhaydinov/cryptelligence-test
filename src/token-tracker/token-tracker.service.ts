import { Catch, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TokenInfo } from './dto/token-info.dto';
import { SolanaConnection } from 'src/token-tracker/utils/solana.connection';
import { DexConnection } from 'src/token-tracker/utils/dex.connection';

@Injectable()
@Catch(InternalServerErrorException)
export class TokenTrackerService {
	private readonly JUPAddress: string;

	constructor(
		private readonly solanaConnection: SolanaConnection,
		private readonly dexConnection: DexConnection
	) {
		this.JUPAddress = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
	}

	async getJUPInfo(): Promise<any> {
		try {
			const liquidityUSD = await this.dexConnection.getUSDLiquidityByAddress(this.JUPAddress);
			const solanaInfo = await this.solanaConnection.getRecentParsedTransactionWithTransferInstruction(
				this.JUPAddress
			);

			return new TokenInfo(
				solanaInfo.transaction,
				solanaInfo.slot,
				solanaInfo.amount,
				solanaInfo.source,
				solanaInfo.destination,
				liquidityUSD
			);
		} catch (err) {
			throw new InternalServerErrorException(err);
		}
	}

	async getParsedTransactionBySignature(signature: string): Promise<any> {
		return await this.solanaConnection.getParsedTransactionBySignature(signature);
	}
}
