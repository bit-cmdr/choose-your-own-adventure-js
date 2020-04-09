/* eslint-disable no-console */
const StateMachine = require('javascript-state-machine');
const StateMachineHistory = require('javascript-state-machine/lib/history');

const States = {
  AccountCreated: 'AccountCreated',
  CharacterDetails: 'CharacterDetails',
  DamageType: 'DamageType',
  SpellDetails: 'SpellDetails',
  WeaponDetails: 'WeaponDetails',
  StartingFaction: 'StartingFaction',
  FinalState: 'Finished',
};

async function damageClass(dmgType) {
  let cls = 'melee';
  if (dmgType.toLowerCase() === 'magic') cls = 'ranged';
  if (dmgType.toLowerCase() === 'mixed') cls = 'ranged_melee';
  return new Promise((resolve) => {
    setTimeout(resolve(cls), 2000);
  });
}

const FSM = StateMachine.factory({
  init: States.AccountCreated,
  transitions: [
    {
      name: 'next',
      from: States.AccountCreated,
      to() {
        if (!this.character.name) return false;
        return States.CharacterDetails;
      },
    },
    {
      name: 'next',
      from: States.CharacterDetails,
      to() {
        if (!this.character.race || !this.character.age) return false;
        return States.DamageType;
      },
    },
    {
      name: 'next',
      from: States.DamageType,
      to() {
        if (!this.character.class) return false;

        switch (this.character.class) {
          case 'ranged':
          case 'ranged_melee':
            return States.SpellDetails;
          default:
            return States.WeaponDetails;
        }
      },
    },
    {
      name: 'next',
      from: States.SpellDetails,
      to() {
        if (
          !Array.isArray(this.character.spells) ||
          !this.character.spells.length
        ) {
          return false;
        }

        if (this.character.class === 'ranged_melee') {
          return States.WeaponDetails;
        }

        return States.StartingFaction;
      },
    },
    {
      name: 'next',
      from: States.WeaponDetails,
      to() {
        if (
          !Array.isArray(this.character.weapons) ||
          !this.character.weapons.length
        ) {
          return false;
        }

        return States.StartingFaction;
      },
    },
    {
      name: 'next',
      from: States.StartingFaction,
      to() {
        if (!this.character.faction) return false;
        return States.FinalState;
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
    onTransition(lifecycle) {
      console.log(`transitioning from ${lifecycle.from} to ${lifecycle.to}`);
    },
    describe() {
      console.log('Your character is', this.character);
      console.log('journey', this.history);
    },
    json() {
      return this.character;
    },
    setName(name) {
      this.character.name = name;
    },
    setDetails(age, race) {
      this.character.age = age;
      this.character.race = race;
    },
    async setClass(damageType) {
      this.character.class = await damageClass(damageType);
    },
    setSpells(spells) {
      this.character.spells = spells;
    },
    setWeapons(weapons) {
      this.character.weapons = weapons;
    },
    setFaction(faction) {
      this.character.faction = faction;
    },
  },
  plugins: [new StateMachineHistory()],
});

module.exports = { FSM, States };
