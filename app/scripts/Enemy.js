import { tagsGenerator } from "./TagsGenerator.js";
import { game } from "./Game.js";
import { Missile, MISSILE_SIZE } from "./Missile.js";
import { Bomb, BOMB_SIZE } from "./Bomb.js";
import { enemies } from "./Enemies.js";

const ENEMY_TYPES = [
  "fighter",
  "bomber",
  "destroyer",
  "commanderShip",
  "starDestroyer",
];
export const ENEMY_MISSILE_CLASS = "enemy-missile";
export const ENEMY_BOMB_CLASS = "enemy-bomb";
const ENEMY_EXPLOSION_BOMB_CLASS = "enemy-bomb--explosion";
const TIMER_OF_EXPLOSION_ANIMATION = 1000;
const TIME_TO_USE_SKILL = 2000;
const TIME_FOR_MOVE_ANIMATION = 30;

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
    this.skillInterval = null;
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
    this.interval = setInterval(
      this.#enemyMoveAnimation,
      TIME_FOR_MOVE_ANIMATION
    );
    this.#skillForEnemyByType();
  }

  #enemyMoveAnimation = () => {
    const { speed } = this.ship;
    this.posY += speed;

    this.element.style.top = `${this.posY}px`;
  };

  #skillForEnemyByType() {
    if (this.type === ENEMY_TYPES[0]) {
      this.skillInterval = setInterval(this.#fighterShot, TIME_TO_USE_SKILL);
    } else if (this.type === ENEMY_TYPES[1]) {
      this.skillInterval = setInterval(this.#plantBomb, TIME_TO_USE_SKILL);
    } else if (this.type === ENEMY_TYPES[2]) {
      this.skillInterval = setInterval(
        this.#destroyerDoubleShot,
        TIME_TO_USE_SKILL
      );
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

  #plantBomb = () => {
    const { size } = this.ship;
    const posX = this.posX + (size - BOMB_SIZE) / 2;
    const posY = this.posY;

    const bomb = new Bomb(
      posX,
      posY,
      ENEMY_BOMB_CLASS,
      ENEMY_EXPLOSION_BOMB_CLASS
    );
    enemies.enemiesBombs.push(bomb);
  };

  #shot(posX, posY) {
    const missile = new Missile(posX, posY, ENEMY_MISSILE_CLASS);
    enemies.enemiesMissiles.push(missile);
  }

  explosionOfEnemyShip() {
    const { shipClass, explosionClass } = this.ship;
    this.element.classList.remove(shipClass);
    this.element.classList.add(explosionClass);
    this.#stopAnimate();
    setTimeout(() => this.#removeEnemy(), TIMER_OF_EXPLOSION_ANIMATION);
  }

  enemyIsOutsideMap() {
    this.#removeEnemy();
    this.#stopAnimate();
  }

  #removeEnemy() {
    this.element.remove();
  }

  #stopAnimate() {
    clearInterval(this.skillInterval);
    clearInterval(this.interval);
  }
}
