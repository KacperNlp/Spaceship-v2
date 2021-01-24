import { BindToHtml } from "./BindToHtml.js";

const GAME_LAYER_ID = "game";

class Game extends BindToHtml {
  constructor() {
    super(GAME_LAYER_ID);
  }
}

export const game = new Game();
