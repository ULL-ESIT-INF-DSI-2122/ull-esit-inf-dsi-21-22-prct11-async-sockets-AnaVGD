// import { Socket } from 'dgram';
import * as net from 'net';
/**
 * Clase CLiente
 */
export class Client {
  private client = net.connect({port: 60300});
  /**
   * Paso los comando
   * @param com Comando
   * @param option Opcion del comando
   * @param fileName N ombre del fichero
   */
  constructor(private com: string, private option: string, private fileName: string) {

  }
  /**
   * Encaragdo de ejecutar el programa
   */
  run() {
    // let wholeData = '';
    // this.client.on('data', (dataChunk) => {
    //   wholeData += dataChunk;
    // });

    this.client.on('error', (err) => {
      process.stderr.write(err.message);
    });

    this.client.write(JSON.stringify({'comman': this.com, 'option': this.option, 'file': this.fileName}) +
      '\n');
    this.client.end();

    this.client.on('end', () => {
      console.log(`Connection established: watching file ${this.fileName}`);
    });
  }
}

const comm = process.argv[2];
const opt = process.argv[3];
const file = process.argv[4];
const cli = new Client(comm, opt, file);
// const cli = new Client('cat', '-ana', 'text.txt');
cli.run();
