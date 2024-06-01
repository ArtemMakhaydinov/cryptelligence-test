import { Catch, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
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
			console.log('liquidityUSD', liquidityUSD);
			const solanaInfo = await this.solanaConnection.getRecentParsedTransactionWithTransferInstruction(
				this.JUPAddress
			);

			console.log('solanaInfo', solanaInfo);
			const tokenInfo = Object.assign(new TokenInfo(), solanaInfo);
			tokenInfo.liquidityUSD = liquidityUSD;
			return tokenInfo;
		} catch (err) {
			throw new InternalServerErrorException(err);
		}
	}

	async getParsedTransactionBySignature(signature: string): Promise<any> {
		return await this.solanaConnection.getParsedTransactionBySignature(signature);
	}
}
