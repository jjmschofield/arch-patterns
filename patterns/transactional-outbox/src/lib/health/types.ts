import {CpuInfo, NetworkInterfaceInfo} from "os";

export interface Health {
  status: string;
  uptime: number;
  hostname: string;
  nics: { [index: string]: NetworkInterfaceInfo[] };
  cpu: Cpu;
  mem: Mem;
}

interface Cpu {
  cpus: CpuInfo[];
  loadavg: number[];
}

interface Mem {
  total: number;
  free: number;
}


