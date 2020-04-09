/* eslint-disable no-console */
const scanf = require('readline-sync');
const { FSM, States } = require('./src');

async function begin() {
  const name = scanf.question('Character Name > ');
  console.log('current state', FSM.state);
  FSM.setName(name);
  FSM.details();

  const age = scanf.question('Character Age > ');
  const race = scanf.question(
    'Character Race (Human, Elf, Orc, Half-Elf, Half-Orc, Tiefling, Drow, Etc...) > ',
  );
  FSM.setDetails(age, race);
  FSM.moreDetails();

  console.log('current state', FSM.state);
  const cls = scanf.question('Character Damage Type (melee, magic, mixed) > ');
  await FSM.setClass(cls);
  FSM.damageClass();

  console.log('current state', FSM.state);
  if (FSM.state === States.SpellDetails) {
    const spellName = scanf.question('Spell Name > ');
    const spellDmg = scanf.question('Spell Damage > +');
    FSM.setSpells([{ name: spellName, damage: spellDmg }]);
    FSM.spells();
  }

  console.log('current state', FSM.state);
  if (FSM.state === States.WeaponDetails) {
    const weaponName = scanf.question('Weapon Name > ');
    const weaponDamage = scanf.question('Weapon Damage > +');
    FSM.setWeapons([{ name: weaponName, damage: weaponDamage }]);
    FSM.weapons();
  }

  console.log('current state', FSM.state);
  const faction = scanf.question('Character Faction > ');
  FSM.setFaction(faction);
  FSM.finish();

  console.log('current state', FSM.state);
  if (FSM.state === States.FinalState) console.log('describe', FSM.describe());
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
