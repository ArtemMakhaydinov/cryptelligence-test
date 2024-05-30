import { Module } from '@nestjs/common';
import { TokenTrackerModule } from './token-tracker/token-tracker.module';

@Module({
	imports: [TokenTrackerModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
