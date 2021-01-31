import { BindToHtml } from "./BindToHtml.js";
import { Player, SHIP_SIZE } from "./Player.js";
import { enemies } from "./Enemies.js";
import { GameState } from "./GameState.js";
import { MISSILE_SIZE } from "./Missile.js";
import { BOMB_SIZE } from "./Bomb.js";
import { store } from "./Store.js";
import {
  HIDDEN_LAYER,
  visibilityOfLayers,
  VISIBLE_LAYER,
} from "./VisibilityOfLayers.js";
import { allies } from "./Allies.js";
import { storage } from "./Storage.js";
import { message } from "./Message.js";
import { gameAudio } from "./GameAudio.js";
import { mainMenu } from "./MainMenu.js";
import { settings } from "./Settings.js";

const GAME_LAYER_ID = "game";
const GAME_MAP_ID = "game-map";
const OPEN_STORE_BUTTON_ID = "open-store-button";
const PLAYER_LIVES_CONTAINER_ID = "player-lives";
const PLAYER_SCORE_CONTAINER_ID = "player-score";
const PLAYER_WALLET_CONTAINER_ID = "player-diamonds";
const RETURN_BUTTON_ID = "return";
const SETTINGS_BUTTON_ID = "settings-in-game";

class Game extends BindToHtml {
  #player = null;

  constructor() {
    super(GAME_LAYER_ID);
    this.gameMap = this.bindById(GAME_MAP_ID);
    this.enemiesGeneratorInterval = null;
    this.gameState = null;
    this.isInGame;
    this.#returnAndSettingsHandle();
  }

  #returnAndSettingsHandle() {
    this.#handleReturnButton();
    this.#handleSettingsButton();
  }

  #handleReturnButton() {
    const button = this.bindById(RETURN_BUTTON_ID);
    button.addEventListener("click", () => {
      this.#stopAnimateAll();

      visibilityOfLayers.changeVisibilityOfLayer(this.layer, HIDDEN_LAYER);
      visibilityOfLayers.changeVisibilityOfLayer(mainMenu.layer, VISIBLE_LAYER);
    });
  }

  #handleSettingsButton() {
    const button = this.bindById(SETTINGS_BUTTON_ID);
    button.addEventListener("click", () => {
      visibilityOfLayers.changeVisibilityOfLayer(settings.layer, VISIBLE_LAYER);
    });
  }

  newGame() {
    this.isInGame = true;
    store.generateStore();
    const typeOfShip = this.#getShipType();
    enemies.createEnemy();
    this.#player = new Player(typeOfShip);
    this.gameState = new GameState();

    this.#enemiesGenerator();
    this.#renderGameMap();
    this.#handleOpenStoreButton();
  }

  #enemiesGenerator() {
    this.enemiesGeneratorInterval = setInterval(
      enemies.createEnemy,
      this.gameState.timeToRenderNewEnemy
    );
  }

  #renderGameMap = () => {
    if (this.isInGame) {
      this.#updatePlayerStats();
      this.#checksPositionOfEnemies(this.#player.missiles);
      this.#checksPositionOfEnemies(allies.alliesMissiles);
      this.#checksPositionsOfBombs(this.#player.missiles);
      this.#checksPositionsOfBombs(allies.alliesMissiles);
      this.#checksIsPlayerLostLive();
      this.#checksIsAllyLostLive();
      this.#checksScoreToIncreaseDifficulty();
      this.#checksEndOfGame();

      requestAnimationFrame(this.#renderGameMap);
    }
  };

  #handleOpenStoreButton() {
    const button = this.bindById(OPEN_STORE_BUTTON_ID);
    button.addEventListener("click", () => {
      visibilityOfLayers.changeVisibilityOfLayer(store.layer, VISIBLE_LAYER);
    });
  }

  #updatePlayerStats() {
    const livesContainer = this.bindById(PLAYER_LIVES_CONTAINER_ID);
    const pointsContainer = this.bindById(PLAYER_SCORE_CONTAINER_ID);
    const walletContainer = this.bindById(PLAYER_WALLET_CONTAINER_ID);

    livesContainer.textContent = this.gameState.lives;
    pointsContainer.textContent = this.gameState.points;
    walletContainer.textContent = this.gameState.diamonds;
  }

  #checksPositionOfEnemies(alliesMissiles) {
    enemies.allEnemies.forEach((enemy, enemyId, enemies) => {
      const { size } = enemy.ship;

      const enemyPosition = {
        enemyBottomLeft: enemy.posX,
        enemyBottomRight: enemy.posX + size,
        enemyBottom: enemy.posY + size,
      };

      alliesMissiles.forEach((missile, missileId, missiles) => {
        const missilePosition = {
          missileTopLeft: missile.posX,
          missileTopRight: missile.posX + MISSILE_SIZE,
          missileTop: missile.posY,
        };

        const isHit = this.#checkPositionsOfMissileAndEnemyElement(
          enemyPosition,
          missilePosition
        );

        //hit the enemy
        if (isHit && enemy.posY >= 0 && missile.posY >= 0) {
          missile.deleteMissile();
          missiles.splice(missileId, 1);
          enemy.ship.hp--;
          //explosion if enemy lost all hp
          if (!enemy.ship.hp) {
            const { prizeForDestroy, pointsForDestroy } = enemy.ship;
            enemy.explosionOfEnemyShip();
            enemies.splice(enemyId, 1);
            gameAudio.explosionSound(enemy.type);

            this.gameState.increasePoints(pointsForDestroy);
            this.gameState.increaseDiamonds(prizeForDestroy);
            this.gameState.increaseNumberOfDestroyedEnemies();
          }
        }
      });
    });
  }

  #checksPositionsOfBombs(alliesMissiles) {
    enemies.enemiesBombs.forEach((bomb, bombId, bombs) => {
      const bombPosition = {
        enemyBottomLeft: bomb.posX,
        enemyBottomRight: bomb.posX + BOMB_SIZE,
        enemyBottom: bomb.posY + BOMB_SIZE,
      };

      alliesMissiles.forEach((missile, missileId, missiles) => {
        const missilePosition = {
          missileTopLeft: missile.posX,
          missileTopRight: missile.posX + MISSILE_SIZE,
          missileTop: missile.posY,
        };

        const isHit = this.#checkPositionsOfMissileAndEnemyElement(
          bombPosition,
          missilePosition
        );

        //hit the enemy
        if (isHit && bomb.posY >= 0 && missile.posY >= 0) {
          gameAudio.playBombExplosion();
          missile.deleteMissile();
          missiles.splice(missileId, 1);

          bomb.bombExplosion();
          bombs.splice(bombId, 1);
        }
      });
    });
  }

  #checksIsPlayerLostLive() {
    this.#lostLiveByEnemyMissile(this.#player, SHIP_SIZE, true);
    this.#lostLiveByEnemyBomb(this.#player, SHIP_SIZE, true);
    this.#enemyPassesPlayerDefense();
  }

  #checksIsAllyLostLive() {
    allies.alliesShips.forEach((ship, id) => {
      const { size } = ship.props;
      this.#lostLiveByEnemyMissile(ship, size, false, id);
      this.#lostLiveByEnemyBomb(ship, size, false, id);
    });
  }

  #getShipType() {
    let typeOfShip = {};

    store.playerShipsArray.forEach((ship) => {
      const { active, unlocked, src, speed, doubleShot } = ship.props;
      if (active && unlocked) {
        typeOfShip.src = src;
        typeOfShip.speed = speed;
        typeOfShip.doubleShot = doubleShot;
      }
    });

    return typeOfShip;
  }

  //change difficulty means deacrease time to render enemy and create boss (huge ship - star destroyer)
  #checksScoreToIncreaseDifficulty() {
    const currentScore = this.gameState.points;
    const requiredScore = this.gameState.requireScoreToNextLevel;

    if (currentScore >= requiredScore) {
      clearInterval(this.timeToRenderNewEnemy);
      this.gameState.updateRequireScoreToNextLevel();
      this.gameState.decreaseTimeToRenderNewEnemy();
      console.log(game.gameState.timeToRenderNewEnemy);

      this.timeToRenderNewEnemy = setInterval(
        enemies.createEnemy(),
        this.gameState.timeToRenderNewEnemy
      );
      enemies.createStarDestroyer();
    }
  }

  #lostLiveByEnemyMissile(ship, size, isPlayerShip, allyId) {
    const { innerHeight } = window;
    enemies.enemiesMissiles.forEach((missile, id, missiles) => {
      const missilePosition = {
        enemyLeft: missile.posX,
        enemyRight: missile.posX + MISSILE_SIZE,
        enemyBottom: missile.posY - MISSILE_SIZE,
        enemyTop: missile.posY,
      };

      const allyShip = this.#takeAlliedShipPosition(ship, size);

      const isHit = this.#checksPositionOfAlliedShipAndEnemyElement(
        allyShip,
        missilePosition
      );

      if (isHit && ship.posY < innerHeight && missile.posY < innerHeight) {
        missile.deleteMissile();
        missiles.splice(id, 1);

        if (isPlayerShip) {
          gameAudio.playLostLiveSound();
          this.gameState.decreaseLives();
        } else {
          ship.props.hp--;
          const { hp } = ship.props;

          if (!hp) {
            gameAudio.explosionSound(ship.props.name);
            ship.explosion();
            allies.alliesShips.splice(allyId, 1);
          }
        }
      }
    });
  }

  #lostLiveByEnemyBomb(ship, size, isPlayerShip, allyId) {
    const { innerHeight } = window;
    enemies.enemiesBombs.forEach((bomb, id, bombs) => {
      const bombPosition = {
        enemyLeft: bomb.posX,
        enemyRight: bomb.posX + BOMB_SIZE,
        enemyBottom: bomb.posY + BOMB_SIZE,
        enemyTop: bomb.posY,
      };

      const allyShip = this.#takeAlliedShipPosition(ship, size);

      const isHit = this.#checksPositionOfAlliedShipAndEnemyElement(
        allyShip,
        bombPosition
      );

      if (isHit && ship.posY < innerHeight && bomb.posY < innerHeight) {
        bomb.bombExplosion();
        bombs.splice(id, 1);
        gameAudio.playBombExplosion();

        if (isPlayerShip) {
          gameAudio.playLostLiveSound();
          this.gameState.decreaseLives();
        } else {
          ship.props.hp--;
          const { hp } = ship.props;

          if (!hp) {
            ship.explosion();
            allies.alliesShips.splice(allyId, 1);
          }
        }
      }
    });
  }

  #enemyPassesPlayerDefense() {
    enemies.allEnemies.forEach((enemy, id, enemies) => {
      const { innerHeight } = window;
      const { size } = enemy.ship;

      if (innerHeight < enemy.posY - size) {
        enemies.splice(id, 1);
        enemy.enemyIsOutsideMap();
        gameAudio.playLostLiveSound();

        //player lost live
        this.gameState.decreaseLives();
      }
    });
  }

  #takeAlliedShipPosition(ship, shipSize) {
    const shipPosition = {
      alliedShipLeft: ship.posX,
      alliedShipRight: ship.posX + shipSize,
      alliedShipBottom: ship.posY + shipSize,
      alliedShipTop: ship.posY,
    };

    return shipPosition;
  }

  //if player missile hit enemy this function will return true
  #checkPositionsOfMissileAndEnemyElement(enemyPosition, missilePosition) {
    const { enemyBottom, enemyBottomLeft, enemyBottomRight } = enemyPosition;
    const { missileTopRight, missileTopLeft, missileTop } = missilePosition;

    //hit the enemy
    if (
      enemyBottom > missileTop &&
      enemyBottomLeft <= missileTopRight &&
      enemyBottomRight >= missileTopLeft
    ) {
      return true;
    }
  }

  //if enemy bomb or missile will hit player or allied ship
  #checksPositionOfAlliedShipAndEnemyElement(alliedShip, enemyElementPosition) {
    const {
      alliedShipBottom,
      alliedShipTop,
      alliedShipLeft,
      alliedShipRight,
    } = alliedShip;
    const {
      enemyBottom,
      enemyTop,
      enemyRight,
      enemyLeft,
    } = enemyElementPosition;

    //hit the enemy
    if (
      alliedShipTop <= enemyBottom &&
      alliedShipBottom >= enemyTop &&
      alliedShipLeft <= enemyRight &&
      alliedShipRight >= enemyLeft
    ) {
      return true;
    }
  }

  changeTypeOfShip(src, speed, doubleShot, hp) {
    this.#player.setTypeOfShip(src, speed, doubleShot);
    this.gameState.lives = hp;
  }

  #checksEndOfGame() {
    if (this.gameState.lives <= 0) {
      clearInterval(this.enemiesGeneratorInterval);
      const recordIsBreak = this.#isRecordBeenBroken();
      this.#stopAnimateAll();
      gameAudio.playSoundForTheEndGame();
      gameAudio.pauseMusic();

      this.isInGame = false;

      const score = this.gameState.points;
      const numberOfDestroyedEnemeis = this.gameState.getNumberOfDestroyedEnemies();
      const numberOfFiredMissiles = this.gameState.getNumberOfFiredMissiles();

      message.setMessage(
        score,
        numberOfDestroyedEnemeis,
        numberOfFiredMissiles,
        recordIsBreak
      );

      visibilityOfLayers.changeVisibilityOfLayer(message.layer, VISIBLE_LAYER);
    }
  }

  #isRecordBeenBroken() {
    const previousScore = storage.getHighestScore();

    if (previousScore < this.gameState.points) {
      storage.setHighestScore(this.gameState.points);
      return true;
    }

    return false;
  }

  #stopAnimateAll() {
    this.#player.missiles.forEach((missile) => missile.deleteMissile());
    this.#player.removePlayer();
    enemies.stopAnimateAll();
    allies.deleteAllAlliesShips();
    clearInterval(this.enemiesGeneratorInterval);
  }
}

export const game = new Game();
