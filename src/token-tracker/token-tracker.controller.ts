import { Controller, Get, Param } from '@nestjs/common';
import { TokenTrackerService } from './token-tracker.service';
import { add } from '@raydium-io/raydium-sdk-v2';

@Controller('/token')
export class TokenTrackerController {
	constructor(private readonly tokenTrackerService: TokenTrackerService) {}

	@Get('/')
	async getJUPInfo(): Promise<any> {
		return await this.tokenTrackerService.getJUPInfo();
	}

	@Get('/tx/:signature')
	async getParsedTransactionBySignature(@Param('signature') signature: string): Promise<any> {
		return await this.tokenTrackerService.getParsedTransactionBySignature(signature);
	}

	@Get('/meta/:address')
	async getMetadataByAddress(@Param('address') address: string): Promise<any> {
		return await this.tokenTrackerService.getMetadataByAddress(address);
	}

	@Get('/acc/:address')
	async getParsedAccountInfoByAddress(@Param('address') address: string): Promise<any> {
		return await this.tokenTrackerService.getParsedAccountInfoByAddress(address);
	}

	@Get('/fee/:address')
	async getTransferFeeConfigByAddress(@Param('address') address: string): Promise<any> {
		return await this.tokenTrackerService.getTransferFeeConfigByAddress(address);
	}

	@Get('/supply/:address')
	async getTokenSupplyByAddress(@Param('address') address: string): Promise<any> {
		return await this.tokenTrackerService.getTokenSupplyByAddress(address);
	}

	@Get('/top20/:address')
	async getTokenLargestAccountsByAddress(@Param('address') address: string): Promise<any> {
		return await this.tokenTrackerService.getTokenLargestAccountsByAddress(address);
	}

	@Get('/accs/:address')
	async getParsedTokenAccountsByOwner(@Param('address') address: string): Promise<any> {
		return await this.tokenTrackerService.getParsedTokenAccountsByOwner(address);
	}

	@Get('/pools/:address')
	async getTokenPoolsByAddress(@Param('address') address: string): Promise<any> {
		return await this.tokenTrackerService.getTokenPoolsByAddress(address);
	}
}
