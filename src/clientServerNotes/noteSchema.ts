import {color} from "./note";

/**
 * Iterfez de una nota
 */
export interface NoteSchema {
  /**
   * Titulo de la nota
   */
  title: string;
  /**
   * Cuerpo de la nota
   */
  body: string;
  /**
   * Color de la nota
   */
  color: color;
}
