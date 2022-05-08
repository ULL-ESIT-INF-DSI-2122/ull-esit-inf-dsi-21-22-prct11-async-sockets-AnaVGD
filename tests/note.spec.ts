import 'mocha';
import {expect} from 'chai';
import {color, Note} from '../src/clientServerNotes/note';

describe('Note', () => {
  const redColor: color = 'red';
  let note1: Note;
  beforeEach(() => {
    note1 = new Note('Ana', 'Hola', redColor);
  });
  it('Existe la clase Note', () => {
    expect(Note != undefined).to.be.true;
  });
  it('Se puede instanciar un objeto de la clase Note', () => {
    expect(note1 instanceof Note).to.be.true;
  });
  it('Posee getter de title', () => {
    expect('getTitle' in note1).to.be.true;
  });
  it('Posee getter de body', () => {
    expect('getBody' in note1).to.be.true;
  });
  it('Posee getter de color', () => {
    expect('getColor' in note1).to.be.true;
  });
  it('Metodo getColor', () => {
    expect(note1.getColor()).to.be.equal(redColor);
  });
  it('Metodo getBody', () => {
    expect(note1.getBody()).to.be.equal('Hola');
  });
  it('Metodo getTitle', () => {
    expect(note1.getTitle()).to.be.equal('Ana');
  });
});
