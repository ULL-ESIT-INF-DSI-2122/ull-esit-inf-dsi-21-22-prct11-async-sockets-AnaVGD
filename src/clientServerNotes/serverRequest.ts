import {Note} from "./note";

/**
 * Interfaz ClientRequest
 */
export interface ServerRequest{
  /**
   * Tipo de la peticion
   */
  type: 'add' | 'mody' | 'remove' | 'read' | 'list';
  /**
   * Usuario de la nota
   */
  success: boolean;
  /**
   * Titulo de la nota
   */
  notes?: Note[];
}
