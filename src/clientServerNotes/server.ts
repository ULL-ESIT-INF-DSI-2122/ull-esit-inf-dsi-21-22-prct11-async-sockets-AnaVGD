import * as net from 'net';
import {Note} from "./note";
import {Management} from './management';
import {ServerRequest} from './serverRequest';
import {EventEmitterServer} from './EventEmitterServer';

/**
 * Servidor que escucha por un puerto
 */
const server = net.createServer((socket) => {
  console.log('Cliente conectado');
  const server = new EventEmitterServer(socket);

  /**
   * Evento que se dispara cuando se recibe un evento de tipo request
   */
  server.on('request', (message) => {
    if (message.type === 'add') {
      const newNote: Note = new Note(message.title, message.body, message.color);
      const managment: Management = new Management();
      const request: ServerRequest = {
        type: 'add',
        success: managment.addNote(newNote, message.user),
      };
      socket.write(JSON.stringify(request));
    } else if (message.type === 'list') {
      const managment: Management = new Management();
      const check: boolean | Note[] = managment.listNote(message.user);
      if (typeof check === 'boolean') {
        const request: ServerRequest = {
          type: 'list',
          success: check,
        };
        socket.write(JSON.stringify(request));
      } else {
        const request: ServerRequest = {
          type: 'list',
          success: true,
          notes: check,
        };
        socket.write(JSON.stringify(request));
      }
    } else if (message.type === 'remove') {
      const managment: Management = new Management();
      const request: ServerRequest = {
        type: 'remove',
        success: managment.rmNote(message.user, message.title),
      };
      socket.write(JSON.stringify(request));
    } else if (message.type === 'read') {
      const managment: Management = new Management();
      const check: boolean | Note = managment.readNote(message.user, message.title);
      if (typeof check === 'boolean') {
        const request: ServerRequest = {
          type: 'read',
          success: check,
        };
        socket.write(JSON.stringify(request));
      } else {
        const request: ServerRequest = {
          type: 'read',
          success: true,
          notes: [check],
        };
        socket.write(JSON.stringify(request));
      }
    } else if (message.type === 'mody') {
      const managment: Management = new Management();
      const request: ServerRequest = {
        type: 'mody',
        success: managment.modifyNote(message.user, message.title, message.body, message.color),
      };
      socket.write(JSON.stringify(request));
    } else {
      socket.write(JSON.stringify({type: 'err'}));
    }
    socket.end();
  });

  socket.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(60300, () => {
  console.log('Esperando conexiones...');
});
