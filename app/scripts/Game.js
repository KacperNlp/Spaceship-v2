import { BindToHtml } from "./BindToHtml.js";
import { Player } from "./Player.js";

const GAME_LAYER_ID = "game";
const GAME_MAP_ID = "game-map";

class Game extends BindToHtml {
  #player = null;
  #gameState = null;

  constructor() {
    super(GAME_LAYER_ID);
    this.gameMap = this.bindById(GAME_MAP_ID);
  }

  newGame() {
    this.#player = new Player();
  }
}

export const game = new Game();
