import {SerialPort} from 'serialport';

/**
 * Gets all active ports
 * @return {string[]} List of ports with connected devices
 */

async function devices() {
  const ports = await SerialPort.list();
  const portnames = ports.map(port => port.path);
  return portnames;
}

export { 
    devices
}