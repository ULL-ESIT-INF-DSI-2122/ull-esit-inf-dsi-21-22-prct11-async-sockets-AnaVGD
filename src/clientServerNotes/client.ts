import * as net from 'net';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {ClientRequest} from "./clientRequest";
import {NoteSchema} from './noteSchema';
import {Note} from "./note";
import {color} from "./note";
import {EventEmitterClient} from './EventEmitterClient';
// import {Management} from './management';

// const client = net.connect({port: 60300});
const socket = net.connect({port: 60300});
const client = new EventEmitterClient(socket);

/**
 * Yarsgs para la introduccion del conmando add
 */
yargs.command({
  command: 'add',
  describe: 'Añadir una nueva nota',
  builder: {
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && typeof argv.body === 'string' && process.argv.length === 7) {
      if (argv.color === 'red' || argv.color === 'green' || argv.color === 'blue' || argv.color === 'yellow') {
        const clientRequest: ClientRequest = {
          type: 'add',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: argv.color,
        };
        socket.write(JSON.stringify(clientRequest) + '\n', (err) => {
          if (err) {
            console.log(chalk.red('Error al enviar el mensaje'));
          } else {
            socket.end();
          }
        });
      } else {
        console.log(chalk.red('Color introducido es erróneo'));
        socket.destroy();
      }
    } else {
      console.log(chalk.red('Datos introducidos son erróneos'));
      socket.destroy();
    }
  },
});

/**
 * Yarsgs para la introduccion del conmando list
 */
yargs.command({
  command: 'list',
  describe: 'Listar notas de un usuario',
  builder: {
    user: {
      describe: 'Nota del usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const clientRequest: ClientRequest = {
        type: 'list',
        user: argv.user,
      };
      socket.write(JSON.stringify(clientRequest) + '\n', (err) => {
        if (err) {
          console.log(chalk.red('Error al enviar el mensaje'));
        } else {
          socket.end();
        }
      });
    } else {
      console.log(chalk.red('Datos introducidos son erróneos'));
    }
  },
});

/**
 * Yarsgs para la introduccion del conmando remove
 */
yargs.command({
  command: 'remove',
  describe: 'Elimina una nota',
  builder: {
    user: {
      describe: 'Nota del usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && process.argv.length === 5) {
      const clientRequest: ClientRequest = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
      socket.write(JSON.stringify(clientRequest) + '\n', (err) => {
        if (err) {
          console.log(chalk.red('Error al enviar el mensaje'));
        } else {
          socket.end();
        }
      });
    } else {
      console.log(chalk.red('Datos introducidos son erróneos'));
    }
  },
});

/**
 * Yarsgs para la introduccion del conmando read
 */
yargs.command({
  command: 'read',
  describe: 'Leer una nota',
  builder: {
    user: {
      describe: 'Nota del usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && process.argv.length === 5) {
      const clientRequest: ClientRequest = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
      socket.write(JSON.stringify(clientRequest) + '\n', (err) => {
        if (err) {
          console.log(chalk.red('Error al enviar el mensaje'));
        } else {
          socket.end();
        }
      });
    } else {
      console.log(chalk.red('Datos introducidos son erróneos'));
    }
  },
});

/**
 * Yarsgs para la introduccion del conmando mody
 */
yargs.command({
  command: 'mody',
  describe: 'Modificar notas de un usuario',
  builder: {
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && typeof argv.body === 'string' && process.argv.length === 7) {
      if (argv.color === 'red' || argv.color === 'green' || argv.color === 'blue' || argv.color === 'yellow') {
        const clientRequest: ClientRequest = {
          type: 'mody',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: argv.color,
        };
        socket.write(JSON.stringify(clientRequest) + '\n', (err) => {
          if (err) {
            console.log(chalk.red('Error al enviar el mensaje'));
          } else {
            socket.end();
          }
        });
      }
    } else {
      console.log(chalk.red('Datos introducidos son erroneos'));
    }
  },
});

yargs.parse();

/**
 * Cuando el cliente recibe un evento de tipo respond
 */
client.on('respond', (data) => {
  // const data = JSON.parse(wholeData);
  if (data.type === 'add') {
    if (data.success) {
      console.log(chalk.green('Nota añadida correctamente'));
    } else {
      console.log(chalk.red('El titulo de la nota ya existe'));
    }
  } else if (data.type === 'list') {
    let print: string = 'Tus Notas: \n';
    if (data.success) {
      console.log(chalk.green('Notas listadas correctamente'));
      data.notes.forEach((noteJSON: NoteSchema) => {
        const note = Note.deserialize(noteJSON);
        print += colors(note.getColor(), note.getTitle());
        print += '\n';
      });
      console.log(print);
    } else {
      console.log(chalk.red('Notas no encontradas'));
    }
  } else if (data.type === 'remove') {
    if (data.success) {
      console.log(chalk.green('Nota eliminada correctamente'));
    } else {
      console.log(chalk.red('Nota no encontrada'));
    }
  } else if (data.type === 'read') {
    if (data.success) {
      console.log(chalk.green('Nota leida correctamente'));
      const note = Note.deserialize(data.notes[0]);
      const result: string = colors(note.getColor(), note.getTitle()) + '\n' +
      colors(note.getColor(), note.getBody()) + '\n';
      console.log(result);
    } else {
      console.log(chalk.red('Nota no encontrada'));
    }
  } else if (data.type === 'mody') {
    if (data.success) {
      console.log(chalk.green('Nota modificada correctamente'));
    } else {
      console.log(chalk.red('Nota no encontrada'));
    }
  } else {
    console.log(chalk.red('Error al procesar el mensaje'));
  }
});

function colors(color: color, printMessage: string): string {
  let print: string = '';
  switch (color) {
    case 'red':
      print += chalk.red(printMessage);
      break;
    case 'green':
      print += chalk.green(printMessage);
      break;
    case 'blue':
      print += chalk.blue(printMessage);
      break;
    case 'yellow':
      print += chalk.yellow(printMessage);
      break;
    default:
      print = chalk.red('Color introducido erróneo');
      break;
  }
  return print;
}

