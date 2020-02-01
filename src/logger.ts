import { Environment } from "./environment";

export class Logger {
	private instanceName: string;

	constructor(name: string) {
		this.instanceName = name;
	}

	static getInstance(name: string): Logger {
		return new Logger(name);
	}

	public debug(...args: any[]) {
		if (Environment.environment === 'dev') {
			console.log([`[${this.instanceName}]`,args]);
		}
	}
}
