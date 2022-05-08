import 'mocha';
import {expect} from 'chai';
// import * as net from 'net';
import {EventEmitter} from 'events';
import {EventEmitterServer} from '../src/clientServerNotes/EventEmitterServer';

describe('EventEmitterServer', () => {
  it('Emite un mensaje de peticion', (done) => {
    const socket = new EventEmitter();
    const client = new EventEmitterServer(socket);

    client.on('request', (message) => {
      expect(message).to.be.eql({'type': 'add', 'user': 'Juan',
        'title': 'Titulo', 'body': 'Cuerpo', 'color': 'yellow'});
      done();
    });

    socket.emit('data', '{"type": "add", "user": "Juan"');
    socket.emit('data', ', "title": "Titulo", "body": "Cuerpo"');
    socket.emit('data', ', "color": "yellow"}');
    socket.emit('data', '\n');
  });
});
