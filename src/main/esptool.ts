
import path from 'path';
import process from 'process';
// import os from 'os';
// import serial from './serial';
import { spawn } from 'child_process';

const cwd = process.cwd();
const esptoolPath = path.join(cwd, '/esptool-2.8/esptool.py');
const readBaud = 115200;
// const write_baud = 460800;
const writeBaud = 921600;

/**
 * A JS API that connects to esptool.py
 *
 * @param {string[]} params - A list of parameters (e.g. flags) passed to esptool.py
 * @param {boolean} [verbose=false] - Should the esptool.py be run verbosely
 * @return {Promise} - Resolves when esptool.py has completed
 */
const esptool = (params, verbose = false, outputCallback: CallableFunction | null = null) =>
  new Promise((resolve, reject) => {
    const proc = spawn("python", [`${esptoolPath}`, ...params]);
    console.log("🚀 ~ file: esptool.ts ~ line 24 ~ newPromise ~ esptoolPath", esptoolPath)
    proc.on('exit', resolve);
    proc.on('error', reject);

    if (verbose) {
      proc.stdout.on('data', data => {
        console.log("stdout data");
        console.log(data.toString('UTF-8'));
        if(outputCallback) {
          outputCallback(data.toString('UTF-8'))
        }
      });
      proc.on('message', data => {
        console.log("stdout message");
        console.log(data.toString());
      });
    }
  });

function download(port, chipSize, filename = 'backup.afl', verbose = false) {
  // chip_size in MB
  const readUntilAddress = chipSize * 1024 * 1024; // number of bytes

  const fpath = path.join(cwd, filename);
  console.log(`** downloading to ${fpath}\n`);

  return esptool(
    [
      `--port=${port}`,
      `--baud=${readBaud}`,
      'read_flash',
      '0',
      readUntilAddress,
      fpath
    ],
    verbose
  );
}

function upload(port, filename, verbose = false, outputCallback: CallableFunction | null = null) {
//   const fpath = path.join(cwd, filename);
  return esptool(
    [`--port=${port}`, `--baud=${writeBaud}`, 'write_flash', '0', filename],
    verbose,
    outputCallback
  );
}

function erase(port, verbose = false) {
  return esptool(
    [`--port=${port}`, `--baud=${writeBaud}`, 'erase_flash'],
    verbose
  );
}

export {
    download,
    upload,
    erase
}