import { SolanaInfo } from '../utils/dto/solana-info.dto';

export class TokenInfo extends SolanaInfo {
	liquidityUSD: string;
	constructor(
		transaction: string,
		slot: number,
		amount: string,
		source: string,
		destination: string,
		liquidityUSD: string
	) {
		super(transaction, slot, amount, source, destination);
		this.liquidityUSD = liquidityUSD;
	}
}
