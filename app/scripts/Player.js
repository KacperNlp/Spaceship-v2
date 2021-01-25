import { Missile } from "./Missile.js";
import { game } from "./Game.js";

const PLAYER_SHIP_ID = "player";
export const SHIP_SIZE = 64;
const POSITION_FROM_BOTTOM = 50;
const SHIP_SPEED = 10;

export class Player {
  constructor() {
    this.posX = 0;
    this.ship = document.getElementById(PLAYER_SHIP_ID);
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
  }

  #setStartingPosition() {
    const { innerWidth } = window;

    this.posX = (innerWidth + SHIP_SIZE) / 2;

    this.ship.style.left = `${this.posX}px`;
    this.ship.style.bottom = `${POSITION_FROM_BOTTOM}px`;
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
      this.posX -= SHIP_SPEED;
      this.ship.style.left = `${this.posX}px`;
    } else if (rightArrow && this.posX < rightMapBorder) {
      this.posX += SHIP_SPEED;
      this.ship.style.left = `${this.posX}px`;
    }

    requestAnimationFrame(this.#shipMovesRightLeft);
  };

  #shot() {
    const posY = this.ship.offsetTop;
    const missile = new Missile(this.posX, posY, game.gameMap);
    this.missiles.push(missile);
  }
}
