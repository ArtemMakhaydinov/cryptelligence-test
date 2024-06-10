export class SolanaInfo {
	transaction: string;
	slot: number;
	amount: string;
	source: string;
	destination: string;

	constructor(transaction: string, slot: number, amount: string, source: string, destination: string) {
		this.transaction = transaction;
		this.slot = slot;
		this.amount = amount;
		this.source = source;
		this.destination = destination;
	}
}
