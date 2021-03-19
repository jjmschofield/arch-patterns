import os from 'os';
import { Health } from './types';

export const getHealth = async () : Promise<Health> => {
  return {
    status: 'UP',
    uptime: process.uptime(),
    hostname: os.hostname(),
    nics: os.networkInterfaces(),
    cpu: {
      cpus: os.cpus(),
      loadavg: os.loadavg(),
    },
    mem: {
      total: os.totalmem(),
      free: os.freemem(),
    },
  }
}
