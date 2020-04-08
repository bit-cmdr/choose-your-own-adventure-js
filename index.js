const { FSM } = require('./src');

console.log('current state', FSM.state);
FSM.step({ name: 'Alexander' });
console.log('current state', FSM.state);
if (!FSM.can('step')) FSM.character = { ...FSM.character, age: 127 };
console.log('current state', FSM.state);
if (!FSM.can('step')) FSM.character = { ...FSM.character, race: 'Tiefling' };
console.log('current state', FSM.state);
if (FSM.can('step')) FSM.step();
console.log('current state', FSM.state);
FSM.step('magic');
console.log('current state', FSM.state);
console.log('describe', FSM.describe());
