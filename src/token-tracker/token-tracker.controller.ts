import { Controller, Get } from '@nestjs/common';
import { TokenTrackerService } from './token-tracker.service';
import { TokenInfo } from './dto/token-info.dto';

@Controller('/token')
export class TokenTrackerController {
	constructor(private readonly tokenTrackerService: TokenTrackerService) {}

	@Get('/')
	async getJUP(): Promise<any> {
		return this.tokenTrackerService.getJUP();
	}

	@Get('/t')
	async getT(): Promise<any> {
		return this.tokenTrackerService.getT();
	}
}
