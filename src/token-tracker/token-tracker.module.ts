import { Module } from '@nestjs/common';
import { TokenTrackerController } from './token-tracker.controller';
import { TokenTrackerService } from './token-tracker.service';
import { DexConnection } from './utils/dex.connection';
import { SolanaConnection } from './utils/solana.connection';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
      envFilePath: ['./.env'],
    }),
	],
	controllers: [TokenTrackerController],
	providers: [TokenTrackerService, DexConnection, SolanaConnection],
})
export class TokenTrackerModule {}
