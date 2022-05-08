import 'mocha';
import {expect} from 'chai';
import {color, Note} from '../src/clientServerNotes/note';
import {Management} from "../src/clientServerNotes/management";


describe('Clase Management', () => {
  let note1: Note;
  const redColor: color = 'red';
  let mana: Management;
  beforeEach(() => {
    note1 = new Note('holi', 'holi', redColor);
    mana = new Management();
  });
  it('Existe la clase', () => {
    expect(Management != undefined).to.be.true;
  });
  it('Se puede instanciar', () => {
    expect(mana instanceof Management).to.be.true;
  });
  it('Tiene un metodo addNote', () => {
    expect('addNote' in mana).to.be.true;
  });
  it('Tiene un metodo modifyNote', () => {
    expect('modifyNote' in mana).to.be.true;
  });
  it('Tiene un metodo rmNote', () => {
    expect('rmNote' in mana).to.be.true;
  });
  it('Tiene un metodo listNote', () => {
    expect('listNote' in mana).to.be.true;
  });
  it('Tiene un metodo readNote', () => {
    expect('readNote' in mana).to.be.true;
  });
  it('El método addNote agrega una nota', () => {
    expect(mana.addNote(note1, 'Pablo')).to.be.true;
    mana.rmNote('Pablo', 'holi');
    // mana.rmDir('Pablo');
  });
  it('El método addNote agrega una nota', () => {
    expect(mana.addNote(note1, 'Pablo')).to.be.true;
    expect(mana.addNote(note1, 'Pablo')).to.be.false;
    mana.rmDir('Pablo');
  });
  it('El método modifyNote modifica una nota', () => {
    mana.addNote(note1, 'Pablo');
    expect(mana.modifyNote('Pablo', 'holi', 'newBody', 'amarillo')).to.be.true;
    expect(mana.modifyNote('Pablo', 'hola', 'newBody', 'amarillo')).to.be.false;
    mana.rmDir('Pablo');
  });
  it('El método rmNote elimana una nota', () => {
    mana.addNote(note1, 'Pablo');
    expect(mana.rmNote('Pablo', 'holi')).to.be.true;
    expect(mana.rmNote('Pablo', 'holo')).to.be.false;
    mana.rmDir('Pablo');
  });
  it('El método listNote muestra notas del usuario', () => {
    // expect(mana.listNote('Pepe')).to.be.true;
    expect(mana.listNote('Ana')).to.be.false;
  });
  it('El método readNote muestra nota del usuario', () => {
    // expect(mana.readNote('Pepe', `Nota1`)).to.be.true;
    expect(mana.readNote('Ana', 'hi')).to.be.false;
  });
  it('El método rmDir elimina directorio del usuario del usuario', () => {
    mana.addNote(note1, 'Pablo');
    expect(mana.rmDir('Pablo')).to.be.true;
    expect(mana.rmDir('Ana')).to.be.false;
  });
});
