import {NoteSchema} from "./noteSchema";

export type color = 'red' | 'green' | 'blue' | 'yellow';
/**
 * Clase Note
 */
export class Note {
  /**
   * Instancia una nota
   * @param title Titulo de la nota
   * @param body Cuerpo de la nota
   * @param color Color de la nota
   */
  constructor(private title: string, private body: string, private color: color) {}

  /**
   * Getter de color
   * @return devuelve color de la nota
   */
  public getColor(): color {
    return this.color;
  }

  /**
   * Getter de body
   * @return devuelve body de la nota
   */
  public getBody(): string {
    return this.body;
  }

  /**
   * Getter de title
   * @return devuelve title de la nota
   */
  public getTitle(): string {
    return this.title;
  }

  static deserialize(note: NoteSchema): Note {
    return new Note(note.title, note.body, note.color);
  }
}
