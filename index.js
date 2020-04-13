/* eslint-disable no-console */
const scanf = require('readline-sync');
const { CharacterService } = require('./src');

async function characterSheet() {
  const characterService = CharacterService((_, __) =>
    console.log('done', _, __),
  );
  const name = scanf.question('Character Name > ');
  characterService.send('NEXT', { name });

  const age = scanf.question('Character Age > ');
  const race = scanf.question(
    'Character Race (Human, Elf, Orc, Half-Elf, Half-Orc, Tiefling, Drow, Etc...) > ',
  );
  characterService.send('NEXT', { age, race });

  const dmgType = scanf.question(
    'Character Damage Type (melee, magic, mixed) > ',
  );
  const res = characterService.send('NEXT', { dmgType });
  const dt = await new Promise((resolve) =>
    res.children.fetchDamageType.subscribe((v) => resolve(v)),
  );

  if (dt === 'ranged' || dt === 'ranged_melee') {
    const spellName = scanf.question('Spell Name > ');
    const spellDmg = scanf.question('Spell Damage > +');
    characterService.send('NEXT', {
      spells: [{ name: spellName, damage: spellDmg }],
    });
  }

  if (dt === 'melee' || dt === 'ranged_melee') {
    const weaponName = scanf.question('Weapon Name > ');
    const weaponDamage = scanf.question('Weapon Damage > +');
    characterService.send('NEXT', {
      weapons: [{ name: weaponName, damage: weaponDamage }],
    });
  }

  const faction = scanf.question('Character Faction > ');
  const final = characterService.send('NEXT', { faction });

  return final;
}

async function begin() {
  const characters = [];
  const histories = [];
  let create = 'y';
  while (create === 'y') {
    try {
      // eslint-disable-next-line no-await-in-loop
      const c = await characterSheet();
      characters.push((c || {}).context || null);
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
