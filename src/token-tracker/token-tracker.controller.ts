import { Controller, Get, Param } from '@nestjs/common';
import { TokenTrackerService } from './token-tracker.service';

@Controller('/token')
export class TokenTrackerController {
	constructor(private readonly tokenTrackerService: TokenTrackerService) {}

	@Get('/')
	async getJUPInfo(): Promise<any> {
		return await this.tokenTrackerService.getJUPInfo();
	}

	@Get('/:signature')
	async getParsedTransactionBySignature(@Param('signature') signature: string): Promise<any> {
		return await this.tokenTrackerService.getParsedTransactionBySignature(signature);
	}
}
