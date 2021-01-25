import { tagsGenerator } from "./TagsGenerator.js";
import { SHIP_SIZE, PLAYER_MISSILE_CLASS } from "./Player.js";
import { ENEMY_MISSILE_CLASS } from "./Enemy.js";
import { game } from "./Game.js";

const ANIMATION_SPEED = 30;
const MISSILE_SPEED = 10;
export const MISSILE_SIZE = 15;

export class Missile {
  constructor(posX, posY, missleClass) {
    this.element = null;
    this.missleClass = missleClass;
    this.interval = null;
    this.posX = posX;
    this.posY = posY;
    this.#init();
  }

  #init() {
    this.element = tagsGenerator.createTag("div");
    this.element.classList.add(this.missleClass);
    this.element.style.left = `${this.posX}px`;
    this.element.style.top = `${this.posY}px`;

    game.gameMap.appendChild(this.element);
    this.interval = setInterval(this.#missileMove, ANIMATION_SPEED);
  }

  #missileMove = () => {
    if (this.missleClass === PLAYER_MISSILE_CLASS) {
      this.posY -= MISSILE_SPEED;
    } else if (this.missleClass === ENEMY_MISSILE_CLASS) {
      this.posY += MISSILE_SPEED;
    }

    this.element.style.top = `${this.posY}px`;

    this.#checksIsMissileOutsideMap();
  };

  displayMissile() {
    this.element.remove();
    this.#removeInterval();
  }

  #removeInterval() {
    clearInterval(this.interval);
  }

  #checksIsMissileOutsideMap() {
    const { innerHeight } = window;
    if (this.posY < -MISSILE_SIZE || innerHeight + MISSILE_SIZE < this.posY) {
      this.displayMissile();
    }
  }
}
