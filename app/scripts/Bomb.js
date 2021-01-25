import { tagsGenerator } from "./TagsGenerator.js";
import { ENEMY_BOMB_CLASS } from "./Enemy.js";
import { game } from "./Game.js";

export const BOMB_SIZE = 40;
const MOVE_SPEED = 1;
const TIME_FOR_INTERVAL = 80;

export class Bomb {
  constructor(posX, posY, bombClass) {
    this.bombClass = bombClass;
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
    this.element.remove();
    this.#removeInterval();
  }

  #removeInterval() {
    clearInterval(this.interval);
  }

  #checksIsBombOutsideMap() {
    const { innerHeight } = window;
    if (this.posY < -BOMB_SIZE || innerHeight + BOMB_SIZE < this.posY) {
      this.deleteBomb();
    }
  }
}
