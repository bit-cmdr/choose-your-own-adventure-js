const scanf = require('readline-sync');
const { FSM } = require('./src');

const name = scanf.question('Character Name > ');
console.log('current state', FSM.state);
FSM.step({ name });
const age = scanf.question('Character Age > ');
console.log('current state', FSM.state);
if (!FSM.can('step')) FSM.character = { ...FSM.character, age };
const race = scanf.question(
  'Character Race (Human, Elf, Orc, Half-Elf, Half-Orc, Tiefling, Drow, Etc...) > ',
);
console.log('current state', FSM.state);
if (!FSM.can('step')) FSM.character = { ...FSM.character, race };
console.log('current state', FSM.state, FSM.character);
if (FSM.can('step')) FSM.step();
console.log('current state', FSM.state);
const cls = scanf.question('Character Damage Type (melee, magic, mixed) > ');
FSM.step(cls);
console.log('current state', FSM.state);
console.log('describe', FSM.describe());
