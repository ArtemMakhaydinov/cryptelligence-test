import { DotenvParseOutput, config } from 'dotenv';
import { IEnvConfig, IEnvConfigStatic } from './env.config.interface';

export class EnvConfig implements IEnvConfig {
	private config: DotenvParseOutput;
	static instance: InstanceType<IEnvConfigStatic>;

	constructor() {
		const { error, parsed } = config();
		if (error) throw new Error("Can't find .env");
		if (!parsed) throw new Error('.env is empty');
		this.config = parsed;
		if (EnvConfig.instance) return EnvConfig.instance;
	}

	static getInstance() {
		if (!this.instance) this.instance = new EnvConfig();
		return this.instance;
	}

	get(key: string): string {
		const result = this.config[key];
		if (!result) throw new Error('No such key in .env');
		return result;
	}
}
