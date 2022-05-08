import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as chalk from 'chalk';
import {Note, color} from './note';
import {NoteSchema} from './noteSchema';

/**
 * Clase Management, encargada de gestionar los comandos introducidos
 */
export class Management {
  constructor() {}

  /**
   * Método addNote, encargado de añadir notas a la base de datos
   * @param note Se le pasa la nota a añadir
   * @param user Se pasa el usuario al que pertenece la nota
   */
  addNote(note: Note, user: string): boolean {
    const dir: string = `./Notes/${user}/${note.getTitle()}.json`;
    if (!fs.existsSync('./Notes')) {
      fs.mkdirSync('./Notes');
    }
    if (!fs.existsSync(`./Notes/${user}`)) {
      fs.mkdirSync(`./Notes/${user}`);
    }
    if (fs.existsSync(dir)) {
      return false;
    } else {
      try {
        fs.writeFileSync(dir, `{\n  "title": "${note.getTitle()}",\n  "body": "${note.getBody()}",\n  "color": "${note.getColor()}"\n}`);
        return true;
      } catch (err) {
        return false;
      }
    }
  }

  /**
   * Método `modifyNote` encargado de modificar una nota, se le pasa todos los
   * atributos de la nota
   * @param user Usuario al que pertenece la nota
   * @param title Titulo de la nota
   * @param body Cuerpo de la nota
   * @param color Color de la nota
   */
  modifyNote(user: string, title: string, body: string, color: string): boolean {
    if (!fs.existsSync(`./Notes/${user}/${title}.json`)) {
      return false;
    } else {
      try {
        const dir: string = `./Notes/${user}/${title}.json`;
        fs.writeFileSync(dir, `{\n  "title": "${title}",\n  "body": "${body}",\n  "color": "${color}"\n}`);
        return true;
      } catch (err) {
        return false;
      }
    }
  }

  /**
   * Método `rmNote` encargado de eliminar una nota a partir del usuario al que
   * pertenece y el titulo de la nota.
   * @param user Usuario de la nota
   * @param title Titulo de la nota
   */
  rmNote(user: string, title: string): boolean {
    const dir: string = `./Notes/${user}/${title}.json`;
    if (!fs.existsSync(dir)) {
      return false;
    } else {
      try {
        fs.rmSync(dir);
        return true;
      } catch (err) {
        return false;
      }
    }
  }

  /**
   * Método `listNote` encargado de mostrar la notas que tiene un usuario.
   * @param user Usuario al que se quiere mostrar sus notas
   */
  listNote(user: string): Note[] | boolean {
    if (!fs.existsSync(`./Notes/${user}`)) {
      // console.log(chalk.red('Notas no encontradas'));
      return false;
    } else {
      const dir: string = './Notes/' + user;
      const list: string[] = [];
      fs.readdirSync(dir).forEach((element) => {
        list.push(element);
      });
      // console.log(list);
      if (list.length == 0) {
        // console.log(chalk.red(`El usuario ${user} no tiene notas`));
        return false;
      } else {
        // let print: string = 'Tus Notas: \n';
        // let count: number = 0;
        let check: boolean = true;
        const notes: Note[] = [];
        list.forEach((element) => {
          try {
            const readDir = fs.readFileSync(`./Notes/${user}/${element}`).toString();
            const noteJason: NoteSchema = JSON.parse(readDir);
            if (noteJason.title && noteJason.body && noteJason.color) {
              const note: Note = Note.deserialize(noteJason);
              if (readDir.split(',').length != 3 || note.getBody() == undefined || note.getColor() == undefined || note.getTitle() == undefined ) {
                check = false;
              } else {
                notes.push(note);
              }
            }
          } catch (err) {
            check = false;
          }
        });
        if (check) {
          return notes;
        } else {
          return false;
        }
      }
    }
  }

  /**
   * Método `readNote` muestra por consola el cuerpo de una nota
   * @param user Usuario al que pertenece la nota a mostrar
   * @param title Titulo de la nota a mostrar
   */
  readNote(user: string, title: string): Note | boolean {
    if (!fs.existsSync(`./Notes/${user}/${title}.json`)) {
      return false;
    } else {
      try {
        const dir: string = `./Notes/${user}/${title}.json`;
        const readDir: string = fs.readFileSync(dir).toString();
        const noteJason: NoteSchema = JSON.parse(readDir);
        if (noteJason.title && noteJason.body && noteJason.color) {
          const note: Note = Note.deserialize(noteJason);
          if (readDir.split(',').length != 3 || note.getBody() == undefined || note.getColor() == undefined || note.getTitle() == undefined) {
            return false;
          } else {
            return note;
          }
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  }

  /**
 * Método `rmDir` encargado de eliminar un directorio de un usuario
 * @param user usuario a eliminar el directorio
 * @returns devuelve `do it` si se elimino correctamente y `'El directorio no existe'`
 */
  rmDir(user: string): boolean {
    if (!fs.existsSync(`./Notes/${user}`)) {
      return false;
    } else {
      rimraf.sync(`./Notes/${user}`);
      return true;
    }
  }

  /**
   * Se encarga de desvolver uns string con el color indicado por parámetros
   * @param color Color que se desea asigna a un string
   * @param message mensaje previo del string
   * @param printMessage string al que se le decía asigna el color
   * @returns devuelve el string con el color indicado
   */
  colors(color: color, printMessage: string): string {
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
}
