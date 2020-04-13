/* eslint-disable no-console */
const { Machine, assign, interpret } = require('xstate');

async function damageClass(dmgType) {
  let cls = 'melee';
  if (dmgType.toLowerCase() === 'magic') cls = 'ranged';
  if (dmgType.toLowerCase() === 'mixed') cls = 'ranged_melee';
  return new Promise((resolve) => {
    setTimeout(() => resolve(cls), 6000);
  });
}

const characterMachine = Machine(
  {
    id: 'characterSheet',
    initial: 'accountCreated',
    context: {},
    states: {
      accountCreated: {
        on: {
          NEXT: {
            target: 'characterDetails',
            cond: 'hasName',
            actions: 'setName',
          },
        },
      },
      characterDetails: {
        on: {
          NEXT: {
            target: 'chooseDamageType',
            cond: 'hasDetails',
            actions: 'setAgeRace',
          },
        },
      },
      chooseDamageType: {
        on: { NEXT: { target: 'damageType', cond: 'hasDamage' } },
      },
      damageType: {
        invoke: {
          id: 'fetchDamageType',
          src: 'damageClass',
          onDone: { target: 'chosenDamageType', actions: 'setDamageClass' },
          onError: 'chooseDamageType',
        },
      },
      chosenDamageType: {
        on: {
          '': [
            { target: 'spellDetails', cond: 'isRanged' },
            { target: 'weaponDetails', cond: 'isMelee' },
          ],
        },
      },
      spellDetails: {
        on: {
          NEXT: [
            {
              target: 'weaponDetails',
              cond: 'isMixedHasSpells',
              actions: 'setSpells',
            },
            {
              target: 'startingFaction',
              cond: 'hasSpells',
              actions: 'setSpells',
            },
          ],
        },
      },
      weaponDetails: {
        on: {
          NEXT: {
            target: 'startingFaction',
            cond: 'hasWeapons',
            actions: 'setWeapons',
          },
        },
      },
      startingFaction: {
        on: {
          NEXT: {
            target: 'created',
            cond: 'hasFaction',
            actions: 'setFaction',
          },
        },
      },
      created: { type: 'final' },
    },
  },
  {
    guards: {
      hasName: (_, event) => event.name,
      hasDetails: (_, event) => event.age && event.race,
      hasDamage: (_, event) => event.dmgType,
      isRanged: (ctx) =>
        ctx.damageClass === 'ranged' || ctx.damageClass === 'ranged_melee',
      isMelee: (ctx) => ctx.damageClass === 'melee',
      isMixedHasSpells: (ctx, event) =>
        Array.isArray(event.spells) &&
        event.spells.length &&
        ctx.damageClass === 'ranged_melee',
      hasSpells: (_, event) =>
        Array.isArray(event.spells) && event.spells.length,
      hasWeapons: (_, event) =>
        Array.isArray(event.weapons) && event.weapons.length,
      hasFaction: (_, event) => event && event.faction,
    },
    actions: {
      setName: assign((ctx, event) => ({ ...ctx, name: event.name })),
      setAgeRace: assign((ctx, event) => ({
        ...ctx,
        age: event.age,
        race: event.race,
      })),
      setDamageClass: assign((ctx, event) => ({
        ...ctx,
        damageClass: event.data,
      })),
      setSpells: assign((ctx, event) => ({ ...ctx, spells: event.spells })),
      setWeapons: assign((ctx, event) => ({ ...ctx, weapons: event.weapons })),
      setFaction: assign((ctx, event) => ({ ...ctx, faction: event.faction })),
    },
    services: {
      damageClass: (_, event) => damageClass(event.dmgType),
    },
  },
);

function CharacterService(options) {
  const machine =
    options && options.context
      ? characterMachine.withContext(options.context)
      : characterMachine;
  const svc = interpret(machine).onTransition((state) => {
    if (state.history) {
      console.log(
        `transitioned from previous state ${state.history.value} to current state ${state.value}`,
      );
    } else {
      console.log(`starting machine at current state ${state.value}`);
    }
  });

  return options && options.state ? svc.start(options.state) : svc.start();
}

module.exports = { CharacterService };
