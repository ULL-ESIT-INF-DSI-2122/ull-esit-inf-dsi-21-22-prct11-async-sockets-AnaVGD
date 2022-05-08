import {EventEmitter} from 'events';
// import {ServerRequest} from "./serverRequest";

/**
 * Clase que representa un servidor que escucha por un puerto
 */
export class EventEmitterServer extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();

    let wholeData = '';
    /**
     * Evento que se dispara cuando se recibe un evento de tipo data
     */
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('request', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}
