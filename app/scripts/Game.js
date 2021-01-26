import { BindToHtml } from "./BindToHtml.js";
import { Player } from "./Player.js";
import { enemies } from "./Enemies.js";
import { GameState } from "./GameState.js";
import { MISSILE_SIZE } from "./Missile.js";

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
  }

  newGame() {
    enemies.createEnemy();
    this.#player = new Player();
    this.#gameState = new GameState();

    this.#renderGameMap();
  }

  #renderGameMap = () => {
    this.#updatePlayerStats();
    this.#checksPositionOfEnemies();

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

        if (
          enemyBottom > missileTop &&
          enemyLeft <= missileRight &&
          enemyRight >= missileLeft
        ) {
          missile.deleteMissile();
          missiles.splice(missileId, 1);
          enemy.ship.hp--;

          if (!enemy.ship.hp) {
            enemy.explosionOfEnemyShip();
            enemies.splice(enemyId, 1);
          }
        }
      });
    });
  }
}

export const game = new Game();
