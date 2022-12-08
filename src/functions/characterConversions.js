import { Character } from "../classes/Character";
import { CharacterFactory } from "./characterFactory";

//function to make character class objects out of heroes in active roster redux state
export function activeRosterToPlayerTeam(activeRoster) {
  let newTeam = {};
  const characterFactory = new CharacterFactory();
  for (const [key, value] of Object.entries(activeRoster)) {
    const newChar = characterFactory.create(
      value.id,
      value.name,
      value.spriteSheet,
      value.icon,
      { x: value.x, y: value.y, dir: value.dir },
      value.used,
      value.maxStats,
      value.currentStats
    );
    newTeam = { ...newTeam, [newChar.id]: newChar };
  }
  return newTeam;
}

export function convertToChar(hero, defaultDir) {
  const tempHero = {
    id: hero.id,
    name: hero.name,
    spritesheet: hero.spriteSheet,
    icon: hero.icon,
    position: { x: hero.x, y: hero.y, dir: defaultDir },
    used: hero.used,
    maxStats: hero.maxStats,
  };
  let newChar = new Character(tempHero);
  return newChar;
}

export function playerTeamToActiveRoster(playerTeam, roster) {
  let newTeam = {};
  for (const [key, value] of Object.entries(playerTeam)) {
    const { id, name, icon, previousPosition, used, maxStats, currentStats } =
      value;

    const newChar = {
      id: id,
      name: name,
      spriteSheet: roster.collection[id].spriteSheet,
      icon: icon,
      dir: previousPosition.dir,
      x: previousPosition.x,
      y: previousPosition.y,
      used: used,
      maxStats: maxStats,
      currentStats: currentStats,
    };
    newTeam = { ...newTeam, [newChar.id]: newChar };
  }

  return newTeam;
}
