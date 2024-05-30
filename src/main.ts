import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './config/env.config.service';

async function bootstrap() {
	const envConfigService = EnvConfig.getInstance();
	const PORT = envConfigService.get('PORT') || 3000;
	const app = await NestFactory.create(AppModule);
	await app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}
bootstrap();
