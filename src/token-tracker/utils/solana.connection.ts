import { Catch, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
	ConfirmedSignatureInfo,
	Connection,
	ParsedInstruction,
	ParsedTransactionWithMeta,
	PublicKey,
} from '@solana/web3.js';
import { SolanaInfo } from './dto/solana-info.dto';
// import { Metadata, deprecated } from '@metaplex-foundation/mpl-token-metadata';
import {
	getMint,
	getTokenMetadata,
	getTransferFeeConfig,
	TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { LIQUIDITY_STATE_LAYOUT_V4, MAINNET_PROGRAM_ID } from '@raydium-io/raydium-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Catch(InternalServerErrorException)
export class SolanaConnection {
	private readonly endpoint: string;
	private readonly connection: Connection;
	private readonly transactionsAmount: number;
	private request: number;

	constructor(
		private readonly configService: ConfigService
	) {
		this.endpoint = this.configService.get('HTTP_ENDPOINT')
		this.connection = new Connection(this.endpoint);
		this.transactionsAmount = 25;
	}

	async getRecentParsedTransactionWithTransferInstruction(address: string): Promise<SolanaInfo> {
		try {
			const recentTransactions = await this.getTransactionsByAddress(address, this.transactionsAmount);
			for await (const transaction of recentTransactions) {
				if (transaction?.err !== null) continue;
				const parsedTransaction = await this.getParsedTransactionBySignature(transaction?.signature);
				if (!parsedTransaction) continue;
				const lastTransferInstruction = this.findLastTransferInstruction(parsedTransaction);
				if (lastTransferInstruction) {
					return new SolanaInfo(
						transaction.signature,
						parsedTransaction?.slot,
						lastTransferInstruction?.parsed?.info?.amount,
						lastTransferInstruction?.parsed?.info?.source,
						lastTransferInstruction?.parsed?.info?.destination
					);
				}
			}
		} catch (err) {
			console.error(err);
			throw new InternalServerErrorException(err);
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
				}, 1100);
			});
		} catch (err) {
			console.error(err);
			throw new InternalServerErrorException(err);
		}
	}

	private async getTransactionsByAddress(address: string, amount: number): Promise<ConfirmedSignatureInfo[]> {
		try {
			const publicKey = new PublicKey(address);
			const transactions = await this.connection.getSignaturesForAddress(publicKey, { limit: amount });
			return transactions;
		} catch (err) {
			console.error(err);
			throw new InternalServerErrorException(err);
		}
	}

	private findLastTransferInstruction(transaction: ParsedTransactionWithMeta): ParsedInstruction | null {
		const innerInstructions = transaction?.meta?.innerInstructions;
		if (!innerInstructions) return null;
		let result = null;
		innerInstructions.findLast((innerInstruction) => {
			innerInstruction.instructions.findLast((instruction) => {
				const type = (instruction as ParsedInstruction)?.parsed?.type;
				if (type === 'transfer') return (result = instruction);
			});
		});

		return result;
	}

	async getMetadataByAddress(address: string): Promise<any> {
		// const metadataPDA = await deprecated.Metadata.getPDA(new PublicKey(address).toBase58());
		// return await Metadata.fromAccountAddress(this.connection, metadataPDA);
		const metadata = await getTokenMetadata(this.connection, new PublicKey(address), 'finalized', TOKEN_PROGRAM_ID);
		console.log(metadata);
		return metadata;
	}

	async getParsedAccountInfoByAddress(address: string): Promise<any> {
		const accountInfo: any = await this.connection.getParsedAccountInfo(new PublicKey(address));
		if (Buffer.isBuffer(accountInfo?.value?.data)) {
			accountInfo.value.data = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.value.data);
		}
		return accountInfo;
	}

	async getTransferFeeConfigByAddress(address: string): Promise<any> {
		const pubKey = new PublicKey(address);
		const mint = await getMint(this.connection, pubKey, 'confirmed', TOKEN_PROGRAM_ID);
		console.log('Mint', mint);
		const feeConfig = getTransferFeeConfig(mint);
		console.log('Fee config', feeConfig);

		return feeConfig?.newerTransferFee?.transferFeeBasisPoints;
	}

	async getTokenSupplyByAddress(address: string): Promise<any> {
		const pubKey = new PublicKey(address);
		const supply = await this.connection.getTokenSupply(pubKey);
		console.log(supply);
		return supply;
	}

	async getTokenLargestAccountsByAddress(address: string): Promise<any> {
		const pubKey = new PublicKey(address);
		return await this.connection.getTokenLargestAccounts(pubKey);
	}

	async getParsedTokenAccountsByOwner(address: string): Promise<any> {
		const accPubKey = new PublicKey(address);
		const filterPubKey = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
		const accs = await this.connection.getParsedTokenAccountsByOwner(accPubKey, { programId: filterPubKey });
		return accs;
	}

	async getTokenPoolsByAddress(address: string): Promise<any> {
		const sol = 'So11111111111111111111111111111111111111112';
		const base = new PublicKey(sol);
		const quote = new PublicKey(address);
		const accounts = await this.connection.getProgramAccounts(MAINNET_PROGRAM_ID.AmmV4, {
			filters: [
				{ dataSize: LIQUIDITY_STATE_LAYOUT_V4.span },
				{
					memcmp: {
						offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf('baseMint'),
						bytes: base.toBase58(),
					},
				},
				{
					memcmp: {
						offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf('quoteMint'),
						bytes: quote.toBase58(),
					},
				},
			],
		});
		console.log('Length', accounts.length);

		let rawData = accounts.map(({ pubkey, account }) => ({
			id: pubkey.toString(),
			data: LIQUIDITY_STATE_LAYOUT_V4.decode(account.data),
		}));

		return rawData;
	}
}
