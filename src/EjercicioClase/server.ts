import * as net from 'net';
// import * as fs from 'fs';
import {spawn} from 'child_process';
/**
 * Calse Server
 */
export class Server {
  constructor() {}

  /**
   * Encargado de ejecutar el programa
   */
  run() {
    net.createServer({allowHalfOpen: true}, (connection) => {
      console.log('Cliente conectado');
      // console.log(connection.eventNames());

      let message = '';
      connection.on('data', (dataJSON) => {
        message += dataJSON.toString();
        console.log(message);
      });

      connection.on('end', () => {
        const messageJ = JSON.parse(message);
        const comman = spawn(messageJ.comman, [messageJ.option, messageJ.file]);
        let comOutOutput = '';
        comman.stdout.on('data', (piece) => comOutOutput += piece);
        // console.log(comman.eventNames());
        comman.stderr.on('error', () => {
          console.log('error.message');
        });

        comman.on('error', (err) => {
          console.log(err.message);
        });

        comman.on('close', () => {
          console.log(`${comOutOutput}`);
        });
      });

      connection.on('error', (err) => {
        process.stderr.write(err.message);
      });

      connection.on('close', () => {
        console.log('Cliente desconectado');
      });
    }).listen(60300, () => {
      console.log('Conectando');
    });
  }
}

const serv = new Server();
serv.run();
