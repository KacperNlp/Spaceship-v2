import { Enemy } from "./Enemy.js";

const KIND_OF_ENEMIES = {
  fighter: {
    shipClass: "enemy-fighter",
    explosionClass: "",
    size: 64,
    hp: 1,
    chancesToDraw: [1, 40],
    speed: 3,
    prizeForDestroy: 1,
    pointsForDestroy: 1,
  },
  bomber: {
    shipClass: "enemy-bomber",
    explosionClass: "",
    size: 64,
    hp: 1,
    chancesToDraw: [41, 70],
    speed: 3,
    prizeForDestroy: 1,
    pointsForDestroy: 1,
  },
  destroyer: {
    shipClass: "enemy-destroyer",
    explosionClass: "",
    size: 128,
    hp: 3,
    chancesToDraw: [66, 90],
    speed: 2,
    prizeForDestroy: 2,
    pointsForDestroy: 3,
  },
  commanderShip: {
    shipClass: "enemy-commander-ship",
    explosionClass: "",
    size: 150,
    hp: 10,
    chancesToDraw: [91, 100],
    speed: 1,
    prizeForDestroy: 3,
    pointsForDestroy: 5,
  },
  starDestroyer: {
    shipClass: "enemy-star-destroyer",
    explosionClass: "",
    size: 350,
    hp: 50,
    speed: 1,
    prizeForDestroy: 10,
    pointsForDestroy: 15,
  },
};
const RATE_OF_DRAW = 100;

class Enemies {
  constructor() {
    this.allEnemies = [];
    this.enemiesBombs = [];
  }

  createEnemy() {
    const randomNumber = Math.floor(Math.random() * RATE_OF_DRAW + 1);
    const { fighter, destroyer, bomber, commanderShip } = KIND_OF_ENEMIES;
    let enemy;
    let type;

    if (
      randomNumber >= fighter.chancesToDraw[0] &&
      randomNumber <= fighter.chancesToDraw[1]
    ) {
      type = "fighter";
      enemy = new Enemy(fighter, type);
    } else if (
      randomNumber >= destroyer.chancesToDraw[0] &&
      randomNumber <= destroyer.chancesToDraw[1]
    ) {
      type = "destroyer";
      enemy = new Enemy(destroyer, type);
    } else if (
      randomNumber >= bomber.chancesToDraw[0] &&
      randomNumber <= bomber.chancesToDraw[1]
    ) {
      type = "bomber";
      enemy = new Enemy(bomber, type);
    } else if (
      randomNumber >= commanderShip.chancesToDraw[0] &&
      randomNumber <= commanderShip.chancesToDraw[1]
    ) {
      type = "commanderShip";
      enemy = new Enemy(commanderShip, type);
    }

    this.allEnemies.push(enemy);
  }
}

export const enemies = new Enemies();
