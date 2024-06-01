import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfirmedSignatureInfo, Connection, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';

@Injectable()
export class SolanaConnection {
	private readonly endpoint: string;
	private readonly connection: Connection;
	private readonly transactionsAmount: number;

	constructor() {
		this.endpoint = 'https://api.mainnet-beta.solana.com/';
		this.connection = new Connection(this.endpoint);
		this.transactionsAmount = 25;
	}

	async getRecentParsedTransaction(address: string): Promise<ParsedTransactionWithMeta> {
		try {
			const recentTransactions = await this.getTransactionsByAddress(address, this.transactionsAmount);
			const { signature } = recentTransactions.find((transaction) => transaction.err === null);
			if (!signature) throw `Din't find valid transaction in requested pool of ${this.transactionsAmount}`;
			const parsedTransaction = await this.getParsedTransactionBySignature(signature);
			return parsedTransaction;
		} catch (err) {
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private async getParsedTransactionBySignature(signature: string): Promise<ParsedTransactionWithMeta> {
		try {
			const transactionDetails = await this.connection.getParsedTransaction(signature, {
				commitment: 'finalized',
				maxSupportedTransactionVersion: 0,
			});
			return transactionDetails;
		} catch (err) {
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private async getTransactionsByAddress(address: string, amount: number): Promise<ConfirmedSignatureInfo[]> {
		try {
			const publicKey = new PublicKey(address);
			const transactions = await this.connection.getSignaturesForAddress(publicKey, { limit: amount });
			return transactions;
		} catch (err) {
			throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
