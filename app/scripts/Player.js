import { Missile, MISSILE_SIZE } from "./Missile.js";
import { game } from "./Game.js";

export const PLAYER_MISSILE_CLASS = "missile";
const PLAYER_SHIP_ID = "player";
const POSITION_FROM_BOTTOM = 100;
export const SHIP_SIZE = 64;

export class Player {
  constructor({ src, speed }) {
    this.posX = 0;
    this.ship = document.getElementById(PLAYER_SHIP_ID);
    this.src = src;
    this.speed = speed;
    this.movement = {
      rightArrow: false,
      leftArrow: false,
    };
    this.missiles = [];
    this.#init();
  }

  #init() {
    this.#setStartingPosition();
    this.#shipHandle();
    this.setTypeOfShip();
  }

  setTypeOfShip(src = this.src, speed = this.speed) {
    this.src = src;
    this.speed = speed;
    this.ship.style.backgroundImage = `url(${src})`;
  }

  #setStartingPosition() {
    const { innerWidth, innerHeight } = window;

    this.posX = (innerWidth + SHIP_SIZE) / 2;
    this.posY = innerHeight - POSITION_FROM_BOTTOM;

    this.ship.style.left = `${this.posX}px`;
    this.ship.style.top = `${this.posY}px`;
  }

  #shipHandle() {
    this.#shipMoveLeftRight();
    this.#shipShotAndBlockSpamMovement();
    this.#shipMovesRightLeft();
  }

  #shipMoveLeftRight() {
    window.addEventListener("keydown", ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.movement.leftArrow = true;
          break;

        case 39:
          this.movement.rightArrow = true;
          break;
      }
    });
  }

  #shipShotAndBlockSpamMovement() {
    window.addEventListener("keyup", ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.movement.leftArrow = false;
          break;

        case 39:
          this.movement.rightArrow = false;
          break;

        case 32:
          this.#shot();
          break;

        case 38:
          this.#shot();
          break;
      }
    });
  }

  #shipMovesRightLeft = () => {
    const { innerWidth } = window;
    const { leftArrow, rightArrow } = this.movement;
    const rightMapBorder = innerWidth - SHIP_SIZE;

    if (leftArrow && this.posX > 0) {
      this.posX -= this.speed;
      this.ship.style.left = `${this.posX}px`;
    } else if (rightArrow && this.posX < rightMapBorder) {
      this.posX += this.speed;
      this.ship.style.left = `${this.posX}px`;
    }

    requestAnimationFrame(this.#shipMovesRightLeft);
  };

  #shot() {
    const posY = this.ship.offsetTop - MISSILE_SIZE;
    const posX = this.posX + (SHIP_SIZE - MISSILE_SIZE) / 2;
    const missile = new Missile(posX, posY, PLAYER_MISSILE_CLASS);
    this.missiles.push(missile);
  }
}
