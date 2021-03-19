import log from '../logger';
import dotenv from 'dotenv';

enum EVENT_CODES {
  NO_FILE = 'NO_CONFIG_FILE',
}

const load = async (path?: string): Promise<dotenv.DotenvConfigOptions | undefined> => {
  const result = dotenv.config({ path });

  if (result.error) {
    log.warn(EVENT_CODES.NO_FILE, 'No config file found. Configuration is relying on environment variables.');
  }

  return result.parsed;
};

export const config = {
  load,
};

export default config;
