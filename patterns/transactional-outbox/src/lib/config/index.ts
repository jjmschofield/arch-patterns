import log from '../logger';
import dotenv from 'dotenv-safe';

enum EVENT_CODES {
  NO_FILE = 'NO_CONFIG_FILE',
}

const load = async (path?: string): Promise<dotenv.DotenvSafeOptions | undefined> => {
  const result = dotenv.config({ path });

  if (result.error) {
    log.info(EVENT_CODES.NO_FILE, 'There is no config file to load, however all required environment variables are set');
  }

  return result.parsed;
};

export const config = {
  load,
};

export default config;
