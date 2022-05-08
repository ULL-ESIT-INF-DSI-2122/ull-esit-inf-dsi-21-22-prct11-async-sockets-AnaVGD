import {EventEmitter} from 'events';
/**
 * Clase que representa un servidor que escucha por un puerto
 */
export class EventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();

    /**
     * Evento que se dispara cuando se recibe un evento de ripo data
     */
    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;
    });

    /**
     * Evento que se dispara cuando se cierra la conexion
     */
    connection.on('end', () => {
      this.emit('respond', JSON.parse(wholeData));
    });
  }
}
