import { tagsGenerator } from "./TagsGenerator.js";
import { game } from "./Game.js";

export class Enemy {
  constructor({
    shipClass,
    explosionClass,
    size,
    hp,
    speed,
    prizeForDestroy,
    pointsForDestroy,
  }) {
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
  }

  #enemyMoveAnimation = () => {
    const { speed } = this.ship;
    this.posY += speed;

    this.element.style.top = `${this.posY}px`;
  };
}
