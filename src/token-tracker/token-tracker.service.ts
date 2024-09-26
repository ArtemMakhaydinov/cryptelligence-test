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
			const solanaInfo = await this.solanaConnection.getRecentParsedTransactionWithTransferInstruction(this.JUPAddress);

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

	async getMetadataByAddress(address: string): Promise<any> {
		return await this.solanaConnection.getMetadataByAddress(address);
	}

	async getParsedAccountInfoByAddress(address: string): Promise<any> {
		return await this.solanaConnection.getParsedAccountInfoByAddress(address);
	}

	async getTransferFeeConfigByAddress(address: string): Promise<any> {
		return await this.solanaConnection.getTransferFeeConfigByAddress(address);
	}

	async getTokenSupplyByAddress(address: string): Promise<any> {
		return await this.solanaConnection.getTokenSupplyByAddress(address);
	}

	async getTokenLargestAccountsByAddress(address: string): Promise<any> {
		return await this.solanaConnection.getTokenLargestAccountsByAddress(address);
	}

	async getParsedTokenAccountsByOwner(address: string): Promise<any> {
		return await this.solanaConnection.getParsedTokenAccountsByOwner(address);
	}

	async getTokenPoolsByAddress(address: string): Promise<any> {
		return await this.solanaConnection.getTokenPoolsByAddress(address);
	}
}
