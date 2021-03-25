/* tslint:disable:no-console */

import correlator from 'correlation-id';

interface ILogger {
  error(id: string, message: string, payload?: object): void;
  warn(id: string, message: string, payload?: object): void;
  info(id: string, message: string, payload?: object): void;
  verbose(id: string, message: string, payload?: object): void;
  debug(id: string, message: string, payload?: object): void;
  silly(id: string, message: string, payload?: object): void;
}

class Logger implements ILogger {
  error(id: string, message: string, payload: object = {}) {
    console.error(`[ERROR][${id}] ${message}`, assignDefaultProperties(payload));
  }

  warn(id: string, message: string, payload: object = {}) {
    console.warn(`[WARN][${id}] ${message}`, assignDefaultProperties(payload));
  }

  info(id: string, message: string, payload: object = {}) {
    console.log(`[INFO][${id}] ${message}`, assignDefaultProperties(payload));
  }

  verbose(id: string, message: string, payload: object = {}) {
    console.log(`[VERBOSE][${id}] ${message}`, assignDefaultProperties(payload));
  }

  debug(id: string, message: string, payload: object = {}) {
    console.debug(`[DEBUG][${id}] ${message}`, assignDefaultProperties(payload));
  }

  silly(id: string, message: string, payload: object = {}) {
    console.debug(`[SILLY][${id}] ${message}`, assignDefaultProperties(payload));
  }
}

const assignDefaultProperties = (paylod: any) : object => {
  const defaults = {
    correlation: paylod.correlation || correlator.getId(),
  };

  return Object.assign({}, paylod, defaults);
};

export default new Logger();

