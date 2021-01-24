const PLAYER_SHIP_ID = "player";
const SHIP_SIZE = 64;
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
}
