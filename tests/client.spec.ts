import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {EventEmitterClient} from '../src/clientServerNotes/EventEmitterClient';


describe('EventEmitterClient', () => {
  it('Emite un mensaje de respuesta', (done) => {
    const socket = new EventEmitter();
    const client = new EventEmitterClient(socket);

    client.on('respond', (message) => {
      expect(message).to.be.eql({'type': 'add', 'success': true});
      done();
    });

    const data = {
      type: 'add',
      success: true,
    };
    socket.emit('data', JSON.stringify(data));
    socket.emit('end');
  });
});
