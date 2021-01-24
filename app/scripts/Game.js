import { BindToHtml } from "./BindToHtml.js";
import { Player } from "./Player.js";

const GAME_LAYER_ID = "game";

class Game extends BindToHtml {
  #player = null;
  #gameState = null;

  constructor() {
    super(GAME_LAYER_ID);
  }

  newGame() {
    this.#player = new Player();
  }
}

export const game = new Game();
