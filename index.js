/* eslint-disable no-console */
const scanf = require('readline-sync');
const { FSM, States } = require('./src');

async function begin() {
  const name = scanf.question('Character Name > ');
  FSM.setName(name);
  FSM.next();

  const age = scanf.question('Character Age > ');
  const race = scanf.question(
    'Character Race (Human, Elf, Orc, Half-Elf, Half-Orc, Tiefling, Drow, Etc...) > ',
  );
  FSM.setDetails(age, race);
  FSM.next();

  const cls = scanf.question('Character Damage Type (melee, magic, mixed) > ');
  await FSM.setClass(cls);
  FSM.next();

  if (FSM.state === States.SpellDetails) {
    const spellName = scanf.question('Spell Name > ');
    const spellDmg = scanf.question('Spell Damage > +');
    FSM.setSpells([{ name: spellName, damage: spellDmg }]);
    FSM.next();
  }

  if (FSM.state === States.WeaponDetails) {
    const weaponName = scanf.question('Weapon Name > ');
    const weaponDamage = scanf.question('Weapon Damage > +');
    FSM.setWeapons([{ name: weaponName, damage: weaponDamage }]);
    FSM.next();
  }

  const faction = scanf.question('Character Faction > ');
  FSM.setFaction(faction);
  FSM.next();

  if (FSM.is(States.FinalState)) console.log('describe', FSM.describe());
}

begin()
  .then(() => {
    console.log('success');
    process.exit(0);
  })
  .catch((e) => {
    console.error('oops', e);
    process.exit(1);
  });
