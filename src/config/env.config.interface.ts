export interface IEnvConfigStatic {
	instance: InstanceType<this> | null;
	new (...args: any[]): any;
	getInstance(URL: string): InstanceType<this>;
}

export interface IEnvConfig {
	get(key: string): string;
}
