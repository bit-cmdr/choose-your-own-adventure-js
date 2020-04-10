/* eslint-disable no-console */
const scanf = require('readline-sync');
const { FSM, States } = require('./src');

async function characterSheet() {
  const fsm = new FSM({});
  const name = scanf.question('Character Name > ');
  fsm.setName(name);
  fsm.next();

  const age = scanf.question('Character Age > ');
  const race = scanf.question(
    'Character Race (Human, Elf, Orc, Half-Elf, Half-Orc, Tiefling, Drow, Etc...) > ',
  );
  fsm.setDetails(age, race);
  fsm.next();

  const cls = scanf.question('Character Damage Type (melee, magic, mixed) > ');
  await fsm.setClass(cls);
  fsm.next();

  if (fsm.state === States.SpellDetails) {
    const spellName = scanf.question('Spell Name > ');
    const spellDmg = scanf.question('Spell Damage > +');
    fsm.setSpells([{ name: spellName, damage: spellDmg }]);
    fsm.next();
  }

  if (fsm.state === States.WeaponDetails) {
    const weaponName = scanf.question('Weapon Name > ');
    const weaponDamage = scanf.question('Weapon Damage > +');
    fsm.setWeapons([{ name: weaponName, damage: weaponDamage }]);
    fsm.next();
  }

  const faction = scanf.question('Character Faction > ');
  fsm.setFaction(faction);
  fsm.next();

  if (fsm.is(States.FinalState)) return fsm;
  return null;
}

async function begin() {
  const characters = [];
  const histories = [];
  let create = 'y';
  while (create === 'y') {
    try {
      // eslint-disable-next-line no-await-in-loop
      const c = await characterSheet();
      characters.push((c || {}).json() || null);
      histories.push((c || {}).history || null);
    } catch (e) {
      console.log('error', e);
      process.exit(1);
    }
    create = scanf.question('Create another [y|N] ? ');
  }

  characters.forEach((c) => console.log(c));
  histories.forEach((h) => console.log(h));
}

begin()
  .then(() => {
    console.log('fin');
    process.exit(0);
  })
  .catch((e) => {
    console.error('oops', e);
    process.exit(1);
  });
