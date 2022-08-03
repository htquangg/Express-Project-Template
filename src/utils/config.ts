import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';

export class Config {
  data: NodeJS.ProcessEnv;

  constructor() {
    const env = dotenv.config({ path: process.env.dotenv_path || undefined });

    if (env.error) {
      throw env.error;
    }

    this.data = dotenvParseVariables(
      env.parsed as dotenvParseVariables.Parsed,
    ) as NodeJS.ProcessEnv;

    console.log(this.data);
  }
}
