# Práctica 11 - Cliente y servidor para una aplicación de procesamiento de notas de texto

Ana Virginia Giambona Díaz (alu0101322650@ull.edu.es)
<br>
Desarrollo de Sistemas Informáticos

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-AnaVGD/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-AnaVGD?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct10-async-fs-process-AnaVGD&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct10-async-fs-process-AnaVGD)


## Índice
- [Introducción](#idc)
- [Cliente](#id1)
- [Servidor](#id2)
- [EventEmitterClient](#id3)
- [EventEmitterServer](#id4)


## Introducción<a name="idc"></a>
A partir de la implementación de la aplicación de procesamiento de notas de texto que llevó a cabo en la Práctica 9 para escribir un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo net de Node.js.

Las modificaciones que se realizxaron de la implementacion de la practica 9 fueron que en la clase management en vez de devolover un string se devuelve u boolean.

## Cliente<a name="id1"></a>

Podemos encontrar el cliente en el archivo client.js. En el se encuentra la implementacion del paquete yargs que nos permite pasar argumentos por la línea de comandos.

Por ejemplo en el primer caso que seria si el usuario entroduce el comando add como en la practica 9 se le pasa los demas argumentos, pero la diferencia que en este caso, dentro del handler se crea una peticion de tipo `ClientRequest`:

```typescript
export interface ClientRequest{
  type: 'add' | 'mody' | 'remove' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: color;
}
```

Esta peticion posteriormente se escribira en el socket.

De igual forma esto se repite para los demas casos.
```typescript
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
```

Tras finlaizar esto el servidor procesa la petición y enviara una respuesta, que en nuestro caso sera la accion realizada sobre las notas.

Como en nuestro caso estamos utilizaon la clase `EventEmitterClient` para que el cliente pueda escuchar los eventos que se produzcan en el servidor. recibimos un evento `response` que contiene la respuesta del servidor. gestionamos la respuesta en función de la accion que se realizo. El cliente recivira una respouta de la siguiente forma:

```typescript
export interface ServerRequest{
  type: 'add' | 'mody' | 'remove' | 'read' | 'list';
  success: boolean;
  notes?: Note[];
}
```
Si la repuesta es `add` se imprime un mensaje de que se ha añadido la nota si es `mody` se imprime un mensaje de que se ha modificado la nota, si es `remove` se imprime un mensaje de que se ha eliminado la nota, si es `read` se imprime un mensaje de que se ha leido la nota, y si es `list` se imprime un mensaje de que se ha listado las notas. En caso de que `success` sea false se imprime un mensaje de error.

Tambien nos encontramos con la funcion `colors` que nos permite imprimir los colores que se pueden utilizar.

```typescript
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
```

## Servidor<a name="id2"></a>
En el servidor como comente antes, recibe una peticion del cliente `ClientRequest` y la procesa.

En nuestro caso estamos utilizaon la clase `EventEmitterClient` para que el cliente pueda escuchar los eventos que se produzcan en el servidor. Recibimos un evento `request` que contiene la peticion del cliente.

Se comprueba que la peticion sea de tipo `add` o `mody` o `remove` o `read` o `list`.

Si es add se crea una nota con los datos de la peticion y se añade a la lista de notas. Luego se crea una respuesta de tipo `ServerRequest` con el tipo `add` y se envia al cliente.

Esto se repite con el caso de que sea `mody` y `remove`.

Si es list se llama al metdo `listNotes` que nos devuelve una lista de notas o un boolen en caso de error. Luego se compreuba que si es una lista de notas se crea una respuesta de tipo `ServerRequest` con el tipo `list` y la lista de notas con success true y en caso de que sea boolen se  crea una respuesta de tipo `ServerRequest` con el tipo `list`, con success false.

Esto mismo se repite para el caso de que sea read, con la diferencia de que se llama al metodo `readNote` que nos devuelve una nota o un boolen en caso de error.

```typescript
const server = net.createServer((socket) => {
  console.log('Cliente conectado');
  const server = new EventEmitterServer(socket);

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
```

## EventEmitterClient<a name="id3"></a>

La clase EventEmitterClient es una clase que hereda de EventEmitter. Es la que se encarga de escuchar los eventos que se produzcan en el servidor.

Primero concatena el mensaje que se recibe del servidor, luego cuando se recibe un evento de tipo end, emitira un evento de tipo respond y el objeto JSON con el mensaje que se recibe del servidor.

```typescript
export class EventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;
    });
    connection.on('end', () => {
      this.emit('respond', JSON.parse(wholeData));
    });
  }
}
```

## EventEmitterServer<a name="id3"></a>

La clase EventEmitterServer es una clase que hereda de EventEmitter. Es la que se encarga de escuchar los eventos que se produzcan en el cliente.
Cuando se recibe un evento de tipo data, el manejador almacenar un mensaje que finaliza con el caracter ‘\n’. Una vez que se ha recibido un mensaje completo, se emite un evento de tipo request con el objeto JSON que contiene el mensaje.

```typescript
export class EventEmitterServer extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();

    let wholeData = '';
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
```

Para la ejecucion del progama se debe ejecutar el comando:

Para ejecutar el servidor se debe ejecutar el comando:
```bash
node dist/clientServerNotes/server.js
```	
Para la ejecucion del cliente se debe ejecutar el comando:
```bash
node dist/clientServerNotes/client.js
```
justo a continuacion del comando anterior se debe indicar los comando de las hacciones que se quieren relizar sobre las notas, esto se haria de la misma forma que en la practica 9.
