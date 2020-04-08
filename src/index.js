const StateMachine = require('javascript-state-machine');

const States = {
  AccountCreated: 'AccountCreated',
  CharacterDetails: 'CharacterDetails',
  DamageType: 'DamageType',
  SpellDetails: 'SpellDetails',
  WeaponDetails: 'WeaponDetails',
  StartingFaction: 'StartingFaction',
};

const FSM = StateMachine.factory({
  init: States.AccountCreated,
  transitions: [
    {
      name: 'step',
      from: States.AccountCreated,
      to(details) {
        if (!this.character.name && !details && !details.name) return false;
        if (details) this.character = { ...this.character, ...details };
        if (this.character.name) return States.CharacterDetails;
        return false;
      },
    },
    {
      name: 'step',
      from: States.CharacterDetails,
      to(details) {
        if (
          !this.character.age &&
          !this.character.race &&
          (!details || !details.age || !details.race)
        )
          return false;
        if (details) this.character = { ...this.character, ...details };
        if (this.character.race && this.character.age) return States.DamageType;
        return false;
      },
    },
    {
      name: 'step',
      from: States.DamageType,
      to(s) {
        if (s === 'magic') {
          this.character.class = 'ranged';
          return States.SpellDetails;
        }
        this.character.class = 'melee';
        return States.WeaponDetails;
      },
    },
    {
      name: 'goto',
      from: '*',
      to(s) {
        return s;
      },
    },
  ],
  data(character) {
    return { character };
  },
  methods: {
    describe() {
      console.log(`Your character is\n${JSON.stringify(this.character)}`);
    },
    onStep(lifecycle) {
      console.log('transition', lifecycle.transition);
      console.log('from', lifecycle.from);
      console.log('to', lifecycle.to);
    },
  },
});

module.exports = { FSM: new FSM({}) };
