import { tagsGenerator } from "./TagsGenerator.js";
import { SHIP_SIZE } from "./Player.js";

const ANIMATION_SPEED = 30;
const MISSILE_CLASS = "missile";
const MISSILE_SPEED = 10;
const MISSILE_SIZE = 15;

export class Missile {
  constructor(posX, posY, container) {
    this.container = container;
    this.element = null;
    this.posX = posX + (SHIP_SIZE - MISSILE_SIZE) / 2;
    this.posY = posY - MISSILE_SIZE;
    this.interval = null;
    this.#init();
  }

  #init() {
    this.element = tagsGenerator.createTag("div");
    this.element.classList.add(MISSILE_CLASS);
    this.element.style.left = `${this.posX}px`;
    this.element.style.top = `${this.posY}px`;

    this.container.appendChild(this.element);
    this.interval = setInterval(this.#missileMove, ANIMATION_SPEED);
  }

  #missileMove = () => {
    this.posY -= MISSILE_SPEED;
    this.element.style.top = `${this.posY}px`;
  };

  displayMissile() {
    this.element.remove();
    this.#removeInterval();
  }

  #removeInterval() {
    clearInterval(this.interval);
  }
}
