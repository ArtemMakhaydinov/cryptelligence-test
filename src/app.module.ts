import { Module } from '@nestjs/common';
import { TokenTrackerModule } from './token-tracker/token-tracker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
		TokenTrackerModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
