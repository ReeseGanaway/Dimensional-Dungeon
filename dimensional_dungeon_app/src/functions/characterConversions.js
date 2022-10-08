import { Character } from "../classes/Character";

//function to make character class objects out of heroes in active roster redux state
export function activeRosterToPlayerTeam(activeRoster) {
  let newTeam = {};
  for (const [key, value] of Object.entries(activeRoster)) {
    const newChar = new Character(
      value.id,
      value.name,
      value.spriteSheet,
      value.icon,
      value.moveRange,
      { x: value.x, y: value.y, dir: value.dir },
      value.used
    );
    newTeam = { ...newTeam, [newChar.id]: newChar };
  }

  return newTeam;
}

export function convertToChar(hero, defaultDir) {
  let newChar = new Character(
    hero.id,
    hero.name,
    hero.spriteSheet,
    hero.icon,
    hero.moveRange,

    { x: hero.x, y: hero.y, dir: defaultDir },
    false
  );
  console.log(newChar);
  return newChar;
}

export function playerTeamToActiveRoster(playerTeam, roster) {
  let newTeam = {};
  for (const [key, value] of Object.entries(playerTeam)) {
    const { id, name, icon, moveRange, previousPosition, used } = value;

    const newChar = {
      id: id,
      name: name,
      spriteSheet: roster.collection[id].spriteSheet,
      icon: icon,
      moveRange: moveRange,
      dir: previousPosition.dir,
      x: previousPosition.x,
      y: previousPosition.y,
      used: used,
    };
    newTeam = { ...newTeam, [newChar.id]: newChar };
  }
  console.log(newTeam);
  return newTeam;
}
