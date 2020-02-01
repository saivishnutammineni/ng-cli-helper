export type EnvironmentType = 'dev' | 'prod';
export class Environment {
	static environment: EnvironmentType = 'dev';

	static setEnvironment(environment: EnvironmentType) {
		this.environment = environment;
	}
}