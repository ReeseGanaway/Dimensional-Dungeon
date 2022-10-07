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
      value.dir,
      { x: value.x, y: value.y },
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
    defaultDir,
    { x: hero.x, y: hero.y },
    false
  );
  console.log(newChar);
  return newChar;
}

export function playerTeamToActiveRoster(playerTeam, roster) {
  let newTeam = {};
  for (const [key, value] of Object.entries(playerTeam)) {
    const { id, name, icon, moveRange, dir, previousPosition, used, waiting } =
      value;

    const newChar = {
      id: id,
      name: name,
      spriteSheet: roster.collection[id].spriteSheet,
      icon: icon,
      moveRange: moveRange,
      dir: dir,
      x: previousPosition.x,
      y: previousPosition.y,
      used: used,
    };
    newTeam = { ...newTeam, [newChar.id]: newChar };
  }
  console.log(newTeam);
  return newTeam;
}
