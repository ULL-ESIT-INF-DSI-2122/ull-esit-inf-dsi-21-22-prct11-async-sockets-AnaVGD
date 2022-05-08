import {color} from "./note";

/**
 * Interfaz ClientRequest
 */
export interface ClientRequest{
  /**
   * Tipo de la peticion
   */
  type: 'add' | 'mody' | 'remove' | 'read' | 'list';
  /**
   * Usuario de la nota
   */
  user: string;
  /**
   * Titulo de la nota
   */
  title?: string;
  /**
   * Cuerpo de la nota
   */
  body?: string;
  /**
   * Color de la nota
   */
  color?: color;
}
