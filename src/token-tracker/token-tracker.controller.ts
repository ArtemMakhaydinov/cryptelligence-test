import { Controller, Get } from '@nestjs/common';
import { TokenTrackerService } from './token-tracker.service';
import { TokenInfo } from './dto/token-info.dto';

@Controller('/api/token')
export class TokenTrackerController {
	constructor(private readonly tokenTrackerService: TokenTrackerService) {}

	@Get('/jup')
	async getJUP(): Promise<any> {
		return this.tokenTrackerService.getJUP();
	}
}
