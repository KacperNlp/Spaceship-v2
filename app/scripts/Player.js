import { Missile, MISSILE_SIZE } from "./Missile.js";
import { game } from "./Game.js";

export const PLAYER_MISSILE_CLASS = "missile";
const PLAYER_SHIP_ID = "player";
const POSITION_FROM_BOTTOM = 100;
export const SHIP_SIZE = 64;

export class Player {
  constructor({ src, speed, doubleShot }) {
    this.posX = 0;
    this.ship = document.getElementById(PLAYER_SHIP_ID);
    this.props = {
      src,
      speed,
      doubleShot,
    };
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

  setTypeOfShip(
    src = this.props.src,
    speed = this.props.speed,
    doubleShot = this.props.doubleShot
  ) {
    this.props.src = src;
    this.props.speed = speed;
    this.props.doubleShot = doubleShot;

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
    window.addEventListener("keydown", this.#moveLeftRightEvent);
  }

  #shipShotAndBlockSpamMovement() {
    window.addEventListener("keyup", this.#shotOrStopMoveRightLeftEvent);
  }

  #shipMovesRightLeft = () => {
    if (game.isInGame) {
      const { speed } = this.props;
      const { innerWidth } = window;
      const { leftArrow, rightArrow } = this.movement;
      const rightMapBorder = innerWidth - SHIP_SIZE;

      if (leftArrow && this.posX > 0) {
        this.posX -= speed;
        this.ship.style.left = `${this.posX}px`;
      } else if (rightArrow && this.posX < rightMapBorder) {
        this.posX += speed;
        this.ship.style.left = `${this.posX}px`;
      }

      requestAnimationFrame(this.#shipMovesRightLeft);
    }
  };

  #moveLeftRightEvent = ({ keyCode }) => {
    switch (keyCode) {
      case 37:
        this.movement.leftArrow = true;
        break;

      case 39:
        this.movement.rightArrow = true;
        break;
    }
  };

  #shotOrStopMoveRightLeftEvent = ({ keyCode }) => {
    switch (keyCode) {
      case 37:
        this.movement.leftArrow = false;
        break;

      case 39:
        this.movement.rightArrow = false;
        break;

      case 32:
        this.#handleShot();
        break;

      case 38:
        this.#handleShot();
        break;
    }
  };

  #handleShot() {
    const { doubleShot } = this.props;

    if (doubleShot) {
      this.#handleDoubleShot();
    } else {
      this.#handleSingleShot();
    }
  }

  #handleDoubleShot() {
    const posY = this.ship.offsetTop - MISSILE_SIZE;

    const firstShotPosX = this.posX + SHIP_SIZE - MISSILE_SIZE; /// 3;
    const secondShotPosX = this.posX; // + SHIP_SIZE / 2;

    this.#shot(firstShotPosX, posY);
    this.#shot(secondShotPosX, posY);
  }

  #handleSingleShot() {
    const posY = this.ship.offsetTop - MISSILE_SIZE;
    const posX = this.posX + (SHIP_SIZE - MISSILE_SIZE) / 2;

    this.#shot(posX, posY);
  }

  #shot(posX, posY) {
    game.gameState.increaseNumberOfFiredMissiles();
    const missile = new Missile(posX, posY, PLAYER_MISSILE_CLASS);
    this.missiles.push(missile);
  }

  removePlayer() {
    window.removeEventListener("keydown", this.#moveLeftRightEvent);
    window.removeEventListener("keyup", this.#shotOrStopMoveRightLeftEvent);
  }
}
