import { tagsGenerator } from "./TagsGenerator.js";
import { ENEMY_BOMB_CLASS } from "./Enemy.js";
import { game } from "./Game.js";

export const BOMB_SIZE = 40;
const MOVE_SPEED = 1;
const TIME_FOR_INTERVAL = 80;
const TIME_FOR_EXPLOSION_ANIMATE = 1000;

export class Bomb {
  constructor(posX, posY, bombClass, bombExplosionClass) {
    this.bombClass = bombClass;
    this.bombExplosionClass = bombExplosionClass;
    this.element = null;
    this.posX = posX;
    this.posY = posY;

    this.#init();
  }

  #init() {
    this.element = tagsGenerator.createTag("div");
    this.element.style.left = `${this.posX}px`;
    this.element.style.top = `${this.posY}px`;
    this.element.classList.add(this.bombClass);

    game.gameMap.appendChild(this.element);
    this.interval = setInterval(this.#bombMove, TIME_FOR_INTERVAL);
  }

  #bombMove = () => {
    if (this.bombClass === ENEMY_BOMB_CLASS) {
      this.posY += MOVE_SPEED;
    }

    this.element.style.top = `${this.posY}px`;
    this.#checksIsBombOutsideMap();
  };

  deleteBomb() {
    this.#removeElement();
    this.#removeInterval();
  }

  bombExplosion() {
    this.element.classList.remove(this.bombClass);
    this.element.classList.add(this.bombExplosionClass);
    this.#removeInterval();

    setTimeout(this.#removeElement, TIME_FOR_EXPLOSION_ANIMATE);
  }

  #removeInterval() {
    clearInterval(this.interval);
  }

  #removeElement = () => {
    this.element.remove();
  };

  #checksIsBombOutsideMap() {
    const { innerHeight } = window;
    if (this.posY < -BOMB_SIZE || innerHeight + BOMB_SIZE < this.posY) {
      this.deleteBomb();
    }
  }
}
