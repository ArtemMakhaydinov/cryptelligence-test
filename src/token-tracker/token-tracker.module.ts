import { Module } from '@nestjs/common';
import { TokenTrackerController } from './token-tracker.controller';
import { TokenTrackerService } from './token-tracker.service';
import { DexConnection } from './utils/dex.connection';
import { SolanaConnection } from './utils/solana.connection';

@Module({
	imports: [],
	controllers: [TokenTrackerController],
	providers: [TokenTrackerService, DexConnection, SolanaConnection],
})
export class TokenTrackerModule {}
