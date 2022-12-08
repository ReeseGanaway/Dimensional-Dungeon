import { Character } from "../classes/Character";

export function CharacterFactory() {
  this.create = (
    id,
    name,
    spriteSheet,
    icon,
    position,
    used,
    maxStats,
    currentStats = maxStats
  ) => {
    const tempHero = {
      id: id,
      name: name,
      spriteSheet: spriteSheet,
      icon: icon,
      position: { ...position },
      used: used,
      maxStats: maxStats,
      currentStats: currentStats,
    };
    switch (id) {
      case "batman":
        return new Batman(tempHero);
      case "nightwing":
        return new Nightwing(tempHero);
      case "penguin":
        return new Penguin(tempHero);
      case "twoFace":
        return new TwoFace(tempHero);
      case "superman":
        return new Superman(tempHero);
      case "robin":
        return new Robin(tempHero);
      case "drMultiverse":
        return new DrMultiverse(tempHero);
      default:
        break;
    }
  };
}

class Batman extends Character {
  basicAttackDescription = `Batman deals ${this.currentStats.dmg} damage to a single selected enemy`;
  constructor(hero) {
    super(hero);
  }

  basic(enemy) {
    enemy.currentStats.hp -= this.currentStats.dmg;
  }
}

class Nightwing extends Character {
  basicAttackDescription = `Nightwing deals ${this.currentStats.dmg} damage to a single selected enemy`;
  constructor(hero) {
    super(hero);
  }

  basic(enemy) {
    enemy.currentStats.hp -= this.currentStats.dmg;
  }
}

class Penguin extends Character {
  basicAttackDescription = `Penguin deals ${this.currentStats.dmg} damage to a single selected enemy`;
  constructor(hero) {
    super(hero);
  }

  basic(enemy) {
    let count = 0;

    while (count < this.currentStats.dmg) {
      console.log("here");
      const tempCount = count;
      setTimeout(() => {
        enemy.currentStats.hp -= 1;
      }, 100 * tempCount);
      count++;
    }
  }
}

class TwoFace extends Character {
  basicAttackDescription = `Two-Face deals ${this.currentStats.dmg} damage to a single selected enemy`;
  constructor(hero) {
    super(hero);
  }

  basic(enemy) {
    enemy.currentStats.hp -= this.currentStats.dmg;
  }
}

class Superman extends Character {
  basicAttackDescription = `Superman deals ${this.currentStats.dmg} damage to a single selected enemy`;
  constructor(hero) {
    super(hero);
  }

  basic(enemy) {
    enemy.currentStats.hp -= this.currentStats.dmg;
  }
}

class DrMultiverse extends Character {
  basicAttackDescription = `Dr. Multiverse deals ${this.currentStats.dmg} damage to a single selected enemy`;
  constructor(hero) {
    super(hero);
  }

  basic(enemy) {
    enemy.currentStats.hp -= this.currentStats.dmg;
  }
}
class Robin extends Character {
  basicAttackDescription = `Robin deals ${this.currentStats.dmg} damage to a single selected enemy`;
  constructor(hero) {
    super(hero);
  }

  basic(enemy) {
    enemy.currentStats.hp -= this.currentStats.dmg;
  }
}
