import { BindToHtml } from "./BindToHtml.js";
import { Player, SHIP_SIZE } from "./Player.js";
import { enemies } from "./Enemies.js";
import { GameState } from "./GameState.js";
import { MISSILE_SIZE } from "./Missile.js";
import { BOMB_SIZE } from "./Bomb.js";

const GAME_LAYER_ID = "game";
const GAME_MAP_ID = "game-map";
const PLAYER_LIVES_CONTAINER_ID = "player-lives";
const PLAYER_SCORE_CONTAINER_ID = "player-score";
const PLAYER_WALLET_CONTAINER_ID = "player-diamonds";

class Game extends BindToHtml {
  #player = null;
  #gameState = null;

  constructor() {
    super(GAME_LAYER_ID);
    this.gameMap = this.bindById(GAME_MAP_ID);
    this.enemiesGeneratorInterval = null;
  }

  newGame() {
    enemies.createEnemy();
    this.#player = new Player();
    this.#gameState = new GameState();

    this.#enemiesGenerator();
    this.#renderGameMap();
  }

  #enemiesGenerator() {
    this.enemiesGeneratorInterval = setInterval(
      enemies.createEnemy,
      this.#gameState.timeToRenderNewEnemy
    );
  }

  #renderGameMap = () => {
    this.#updatePlayerStats();
    this.#checksPositionOfEnemies();
    this.#checksPositionsOfBombs();
    this.#checksIsPlayerLostLive();
    this.#checksScoreToIncreaseDifficulty();

    requestAnimationFrame(this.#renderGameMap);
  };

  #updatePlayerStats() {
    const livesContainer = this.bindById(PLAYER_LIVES_CONTAINER_ID);
    const pointsContainer = this.bindById(PLAYER_SCORE_CONTAINER_ID);
    const walletContainer = this.bindById(PLAYER_WALLET_CONTAINER_ID);

    livesContainer.textContent = this.#gameState.lives;
    pointsContainer.textContent = this.#gameState.points;
    walletContainer.textContent = this.#gameState.diamonds;
  }

  #checksPositionOfEnemies() {
    enemies.allEnemies.forEach((enemy, enemyId, enemies) => {
      const { size } = enemy.ship;

      const enemyPosition = {
        bottomLeft: enemy.posX,
        bottomRight: enemy.posX + size,
        bottom: enemy.posY + size,
      };

      this.#player.missiles.forEach((missile, missileId, missiles) => {
        const missilePosition = {
          topLeft: missile.posX,
          topRight: missile.posX + MISSILE_SIZE,
          top: missile.posY,
        };

        const {
          bottom: enemyBottom,
          bottomLeft: enemyLeft,
          bottomRight: enemyRight,
        } = enemyPosition;
        const {
          topRight: missileRight,
          topLeft: missileLeft,
          top: missileTop,
        } = missilePosition;

        //hit the enemy
        if (
          enemyBottom > missileTop &&
          enemyLeft <= missileRight &&
          enemyRight >= missileLeft
        ) {
          missile.deleteMissile();
          missiles.splice(missileId, 1);
          enemy.ship.hp--;
          //explosion if enemy lost all hp
          if (!enemy.ship.hp) {
            const { prizeForDestroy, pointsForDestroy } = enemy.ship;
            enemy.explosionOfEnemyShip();
            enemies.splice(enemyId, 1);

            this.#gameState.increasePoints(pointsForDestroy);
            this.#gameState.increaseDiamonds(prizeForDestroy);
          }
        }
      });
    });
  }

  #checksPositionsOfBombs() {
    enemies.enemiesBombs.forEach((bomb, bombId, bombs) => {
      const bombPosition = {
        bottomLeft: bomb.posX,
        bottomRight: bomb.posX + BOMB_SIZE,
        bottom: bomb.posY + BOMB_SIZE,
      };

      this.#player.missiles.forEach((missile, missileId, missiles) => {
        const missilePosition = {
          topLeft: missile.posX,
          topRight: missile.posX + MISSILE_SIZE,
          top: missile.posY,
        };

        const {
          bottom: bombBottom,
          bottomLeft: bombLeft,
          bottomRight: bombRight,
        } = bombPosition;
        const {
          topRight: missileRight,
          topLeft: missileLeft,
          top: missileTop,
        } = missilePosition;

        //hit the enemy
        if (
          bombBottom > missileTop &&
          bombLeft <= missileRight &&
          bombRight >= missileLeft
        ) {
          missile.deleteMissile();
          missiles.splice(missileId, 1);

          bomb.bombExplosion();
          bombs.splice(bombId, 1);
        }
      });
    });
  }

  #checksIsPlayerLostLive() {
    this.#lostLiveByEnemyMissile();
    this.#lostLiveByEnemyBomb();
    //this.#enemyPassesPlayerDefense();
  }

  //change difficulty means deacrease time to render enemy and create boss (huge ship - star destroyer)
  #checksScoreToIncreaseDifficulty() {
    const currentScore = this.#gameState.points;
    const requiredScore = this.#gameState.requireScoreToNextLevel;

    if (currentScore >= requiredScore) {
      clearInterval(this.timeToRenderNewEnemy);
      this.#gameState.updateRequireScoreToNextLevel();
      this.#gameState.decreaseTimeToRenderNewEnemy();

      this.timeToRenderNewEnemy = setInterval(
        enemies.createEnemy(),
        this.#gameState.timeToRenderNewEnemy
      );
      enemies.createStarDestroyer();
    }
  }

  #lostLiveByEnemyMissile() {
    enemies.enemiesMissiles.forEach((missile, id, missiles) => {
      const missilePosition = {
        left: missile.posX,
        right: missile.posX + MISSILE_SIZE,
        bottom: missile.posY - MISSILE_SIZE,
        top: missile.posY,
      };

      this.#isHit(missile, missilePosition, id, missiles);
    });
  }

  #lostLiveByEnemyBomb() {
    enemies.enemiesBombs.forEach((bomb, id, bombs) => {
      const bombPosition = {
        left: bomb.posX,
        right: bomb.posX + BOMB_SIZE,
        bottom: bomb.posY - BOMB_SIZE,
        top: bomb.posY,
      };

      this.#stepOnBomb(bomb, bombPosition, id, bombs);
    });
  }

  #isHit(enemyMissile, enemyMisslePositins, enemyMissleId, enemyMissiles) {
    const {
      left: enemyLeft,
      right: enemyRight,
      bottom: enemyBottom,
      top: enemyTop,
    } = enemyMisslePositins;

    const playerPositions = {
      left: this.#player.posX,
      right: this.#player.posX + SHIP_SIZE,
      bottom: this.#player.posY + SHIP_SIZE,
      top: this.#player.posY,
    };

    const {
      left: playerLeft,
      right: playerRight,
      bottom: playerBottom,
      top: playerTop,
    } = playerPositions;

    if (
      playerTop <= enemyBottom &&
      playerBottom >= enemyTop &&
      playerLeft <= enemyRight &&
      playerRight >= enemyLeft
    ) {
      enemyMissile.deleteMissile();
      enemyMissiles.splice(enemyMissleId, 1);
      this.#gameState.decreaseLives();
    }
  }

  #stepOnBomb(enemyBomb, enemyBombPositins, enemyBombId, enemyBombs) {
    const {
      left: enemyLeft,
      right: enemyRight,
      bottom: enemyBottom,
      top: enemyTop,
    } = enemyBombPositins;

    const playerPositions = {
      left: this.#player.posX,
      right: this.#player.posX + SHIP_SIZE,
      bottom: this.#player.posY + SHIP_SIZE,
      top: this.#player.posY,
    };

    const {
      left: playerLeft,
      right: playerRight,
      bottom: playerBottom,
      top: playerTop,
    } = playerPositions;

    if (
      playerTop <= enemyBottom &&
      playerBottom >= enemyTop &&
      playerLeft <= enemyRight &&
      playerRight >= enemyLeft
    ) {
      enemyBomb.bombExplosion();
      enemyBombs.splice(enemyBombId, 1);
      this.#gameState.decreaseLives();
    }
  }
}

export const game = new Game();
