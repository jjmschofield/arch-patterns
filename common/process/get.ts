import os from 'os';
import { Process } from './types';

export const getProcess = async () : Promise<Process> => {
  return {
    status: 'UP',
    process_title: process.title,
    uptime: process.uptime(),
    hostname: os.hostname(),
  }
}
