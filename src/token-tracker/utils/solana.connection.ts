import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
	ConfirmedSignatureInfo,
	Connection,
	ParsedInstruction,
	ParsedTransactionWithMeta,
	PublicKey,
} from '@solana/web3.js';
import { SolanaInfo } from './dto/solana-info.dto';

@Injectable()
export class SolanaConnection {
	private readonly endpoint: string;
	private readonly connection: Connection;
	private readonly transactionsAmount: number;
	private request: number;

	constructor() {
		this.endpoint = 'https://api.mainnet-beta.solana.com/';
		this.connection = new Connection(this.endpoint);
		this.transactionsAmount = 25;
	}

	async getRecentParsedTransactionWithTransferInstruction(address: string): Promise<SolanaInfo> {
		try {
			const solanaInfo = new SolanaInfo();
			const recentTransactions = await this.getTransactionsByAddress(address, this.transactionsAmount);
			for await (const transaction of recentTransactions) {
				if (transaction?.err !== null) continue;
				const parsedTransaction = await this.getParsedTransactionBySignature(transaction?.signature);
				if (!parsedTransaction) continue;
				const lastTransferInstruction = this.findLastTransferInstruction(parsedTransaction);
				if (lastTransferInstruction) {
					solanaInfo.amount = lastTransferInstruction?.parsed?.info?.amount;
					solanaInfo.destination = lastTransferInstruction?.parsed?.info?.destination;
					solanaInfo.source = lastTransferInstruction?.parsed?.info?.source;
					solanaInfo.slot = parsedTransaction?.slot;
					solanaInfo.transaction = transaction.signature;
					break;
				}
			}

			return solanaInfo;
		} catch (err) {
			console.error(err);
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getParsedTransactionBySignature(signature: string): Promise<ParsedTransactionWithMeta> {
		try {
			return await new Promise((resolve, reject) => {
				setTimeout(async () => {
					const parsedTransaction = await this.connection.getParsedTransaction(signature, {
						commitment: 'finalized',
						maxSupportedTransactionVersion: 0,
					});
					resolve(parsedTransaction);
				}, 1000);
			});
		} catch (err) {
			console.error(err);
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private async getTransactionsByAddress(address: string, amount: number): Promise<ConfirmedSignatureInfo[]> {
		try {
			const publicKey = new PublicKey(address);
			const transactions = await this.connection.getSignaturesForAddress(publicKey, { limit: amount });
			return transactions;
		} catch (err) {
			console.error(err);
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private findLastTransferInstruction(transaction: ParsedTransactionWithMeta): ParsedInstruction | null {
		const innerInstructions = transaction?.meta?.innerInstructions;
		if (!innerInstructions) return null;
		for (let i = innerInstructions.length - 1; i >= 0; i--) {
			const { instructions } = innerInstructions[i];

			for (let j = instructions.length - 1; j >= 0; j--) {
				const instruction = instructions[j];
				const type = (instruction as ParsedInstruction)?.parsed?.type;
				if (type === 'transfer') {
					return instruction as ParsedInstruction;
				}
			}
		}

		return null;
	}
}
