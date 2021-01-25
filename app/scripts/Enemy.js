import { tagsGenerator } from "./TagsGenerator.js";
import { game } from "./Game.js";
import { Missile, MISSILE_SIZE } from "./Missile.js";

const ENEMY_TYPES = [
  "fighter",
  "bomber",
  "destroyer",
  "commanderShip",
  "starDestroyer",
];
export const ENEMY_MISSILE_CLASS = "enemy-missile";

export class Enemy {
  constructor(
    {
      shipClass,
      explosionClass,
      size,
      hp,
      speed,
      prizeForDestroy,
      pointsForDestroy,
    },
    type
  ) {
    this.element = null;
    this.interval = null;
    this.posX = null;
    this.posY = null;
    this.ship = {
      shipClass,
      explosionClass,
      size,
      hp,
      speed,
      prizeForDestroy,
      pointsForDestroy,
    };
    this.enemySkills = {
      missiles: [],
    };
    this.type = type;

    this.#initEnemyProps();
  }

  #initEnemyProps() {
    const { size } = this.ship;
    const { innerWidth } = window;
    this.posY = -size;
    this.posX = Math.floor(Math.random() * (innerWidth - size));
    this.#setEnemy();
  }

  #setEnemy() {
    const { shipClass } = this.ship;

    this.element = tagsGenerator.createTag("div");
    this.element.style.left = `${this.posX}px`;
    this.element.style.top = `${this.posY}px`;
    this.element.classList.add(shipClass);

    game.gameMap.appendChild(this.element);
    this.interval = setInterval(this.#enemyMoveAnimation, 30);
    this.#skillForEnemyByType();
  }

  #enemyMoveAnimation = () => {
    const { speed } = this.ship;
    this.posY += speed;

    this.element.style.top = `${this.posY}px`;
  };

  #skillForEnemyByType() {
    if (this.type === ENEMY_TYPES[0]) {
      setInterval(this.#fighterShot, 2000);
    } else if (this.type === ENEMY_TYPES[2]) {
      setInterval(this.#destroyerDoubleShot, 2000);
    }
  }

  #fighterShot = () => {
    const { size } = this.ship;
    const posX = this.posX + (size - MISSILE_SIZE) / 2;
    const posY = this.posY + size + MISSILE_SIZE;

    this.#shot(posX, posY);
  };

  #destroyerDoubleShot = () => {
    const { size } = this.ship;

    const firstPosX = this.posX + size / 3;
    const secondPosX = this.posX + size / 2;
    const posY = this.posY + size + MISSILE_SIZE;

    this.#shot(firstPosX, posY);
    this.#shot(secondPosX, posY);
  };

  #shot(posX, posY) {
    const missile = new Missile(posX, posY, ENEMY_MISSILE_CLASS);
    this.enemySkills.missiles.push(missile);
  }
}
