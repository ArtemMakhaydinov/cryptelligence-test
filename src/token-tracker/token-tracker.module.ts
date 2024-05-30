import { Module } from '@nestjs/common';
import { TokenTrackerController } from './token-tracker.controller';
import { TokenTrackerService } from './token-tracker.service';

@Module({
	imports: [],
	controllers: [TokenTrackerController],
	providers: [TokenTrackerService],
})
export class TokenTrackerModule {}
