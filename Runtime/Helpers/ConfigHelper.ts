import fs from 'fs';
import path from 'path';

/**
 * Loads global configuration and returns the specified section of the configuration.
 *
 * @returns An object containing configuration settings for the current environment and general settings.
 * @throws An error if the global configuration file or section is invalid.
 */
export const loadGlobalConfig = (): {
  username: string;
  password: string;
  locatorCheck: {
    defaultTimeout: number;
    retries: number;
  };
} => {
  // Adjust the path to locate config.json in the root folder
  const globalConfigPath = path.resolve(process.cwd(), 'config.json');

  if (!fs.existsSync(globalConfigPath)) {
    throw new Error(`Global configuration file not found at path: ${globalConfigPath}`);
  }

  const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));
  const currentEnvironment = process.env.TEST_ENV || globalConfig.defaultEnvironment;

  if (!globalConfig.environments[currentEnvironment]) {
    throw new Error(`Environment '${currentEnvironment}' not found in global configuration.`);
  }

  const environmentConfig = globalConfig.environments[currentEnvironment];
  const locatorCheck = globalConfig.locatorCheck || {
    defaultTimeout: 3000,
    retries: 3,
  };

  console.log(`Using environment: ${currentEnvironment}`);
  return {
    username: environmentConfig.username,
    password: environmentConfig.password,
    locatorCheck,
  };
};
