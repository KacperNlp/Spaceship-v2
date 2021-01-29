import { tagsGenerator } from "./TagsGenerator.js";
import { allies } from "./Allies.js";
import { game } from "./Game.js";
import { PLAYER_MISSILE_CLASS } from "./Player.js";
import { MISSILE_SIZE, Missile } from "./Missile.js";

const MAXIMUM_POSITION_FROM_BOTTOM = 30;
const TIME_TO_USE_SKILL = 1500;
const TIME_FOR_MOVE_ANIMATION = 30;
const TIMER_OF_EXPLOSION_ANIMATION = 1000;
const TYPES_OF_ALLIES = { fighter: "fighter", destroyer: "destroyer" };

export class Ally {
  constructor({
    shipClass,
    explosionClass,
    name,
    hp,
    size,
    speed,
    doubleShot,
    unlocked,
    active,
    cost,
    src,
  }) {
    this.animateInterval = null;
    this.shotInterval = null;
    this.isOnPosition = false;
    this.props = {
      shipClass,
      explosionClass,
      name,
      hp,
      size,
      speed,
      doubleShot,
      unlocked,
      active,
      cost,
      src,
    };
    this.posX = null;
    this.posY = null;
    this.ship = null;
    this.finishMoveToLeftSide = false;

    this.#initialAllyPosition();
  }

  #initialAllyPosition() {
    const { shipClass, size } = this.props;
    const { innerHeight } = window;

    this.posX = this.#randomPositionOnX();
    this.posY = innerHeight + size;

    this.ship = tagsGenerator.createTag("div");
    this.ship.classList.add(shipClass);
    this.ship.style.left = `${this.posX}px`;
    this.ship.style.top = `${this.posY}px`;

    game.gameMap.appendChild(this.ship);

    this.#initAll();
  }

  #randomPositionOnX() {
    const { innerWidth } = window;
    const { size } = this.props;

    const randomPosition = Math.floor(Math.random() * (innerWidth - size));
    return randomPosition;
  }

  #initAll() {
    this.animateInterval = setInterval(
      this.#moveAnimation,
      TIME_FOR_MOVE_ANIMATION
    );
    this.#handleShot();
  }

  #moveAnimation = () => {
    const { innerHeight } = window;
    const { size } = this.props;

    const spaceFromBottom = innerHeight - (MAXIMUM_POSITION_FROM_BOTTOM + size);

    if (this.posY > spaceFromBottom) {
      this.#moveUp();
    } else {
      this.#moveRightLeft();
    }
  };

  #handleShot() {
    const { name } = this.props;
    const { fighter, destroyer } = TYPES_OF_ALLIES;

    if (name === fighter) {
      this.shotInterval = setInterval(this.#fighterShot, TIME_TO_USE_SKILL);
    } else if (name === destroyer) {
      this.shotInterval = setInterval(
        this.#destroyerDoubleShot,
        TIME_TO_USE_SKILL
      );
    }
  }

  #moveUp() {
    const { speed } = this.props;
    this.posY -= speed;
    this.ship.style.top = `${this.posY}px`;
  }

  #moveRightLeft() {
    const { speed, size } = this.props;
    const { innerWidth } = window;

    if (this.posX <= size / 2) {
      this.finishMoveToLeftSide = true;
    } else if (this.posX >= innerWidth - size) {
      this.finishMoveToLeftSide = false;
    }

    //move left
    if (!this.finishMoveToLeftSide) {
      this.posX -= speed;
    } else if (this.finishMoveToLeftSide) {
      //move right
      this.posX += speed;
    }

    this.ship.style.left = `${this.posX}px`;
  }

  #fighterShot = () => {
    const { size } = this.props;
    const posX = this.posX + (size - MISSILE_SIZE) / 2;
    const posY = this.posY - MISSILE_SIZE;

    this.#shot(posX, posY);
  };

  #destroyerDoubleShot = () => {
    const { size } = this.props;

    const firstPosX = this.posX + size / 3;
    const secondPosX = this.posX + size / 2;
    const posY = this.posY - MISSILE_SIZE;

    this.#shot(firstPosX, posY);
    this.#shot(secondPosX, posY);
  };

  #shot(posX, posY) {
    const missile = new Missile(posX, posY, PLAYER_MISSILE_CLASS);
    allies.alliesMissiles.push(missile);
  }

  explosion() {
    const { shipClass, explosionClass } = this.props;

    this.ship.classList.remove(shipClass);
    this.ship.classList.add(explosionClass);
    this.#stopAnimate();
    setTimeout(() => this.#removeAlly(), TIMER_OF_EXPLOSION_ANIMATION);
  }

  #removeAlly() {
    this.ship.remove();
  }

  #stopAnimate() {
    clearInterval(this.shotInterval);
    clearInterval(this.animateInterval);
  }
}
