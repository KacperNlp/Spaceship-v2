import { BindToHtml } from "./BindToHtml.js";
import {
  visibilityOfLayers,
  HIDDEN_LAYER,
  VISIBLE_LAYER,
} from "./VisibilityOfLayers.js";
import { game } from "./Game.js";
import { storage } from "./Storage.js";

const HIGHEST_SCORE_CONTAINER_ID = "main-menu-highest-score";
const MAIN_MENU_LAYER_ID = "main-menu-layer";
const NEW_GAME_BUTTON_ID = "new-game-main-menu";
const SETTINGS_BUTTON_ID = "settings-main-menu";

class MainMenu extends BindToHtml {
  constructor() {
    super(MAIN_MENU_LAYER_ID);
    this.#init();
  }

  #init() {
    this.#buttonsHandle();
    this.setHighestScore();
  }

  #buttonsHandle() {
    this.#newGameButtonHandle();
    this.#settingsButtonHanlde();
  }

  setHighestScore() {
    const container = this.bindById(HIGHEST_SCORE_CONTAINER_ID);
    const score = storage.getHighestScore();

    container.textContent = score;
  }

  #newGameButtonHandle() {
    const button = this.bindById(NEW_GAME_BUTTON_ID);
    button.addEventListener("click", () => {
      visibilityOfLayers.changeVisibilityOfLayer(this.layer, HIDDEN_LAYER);
      visibilityOfLayers.changeVisibilityOfLayer(game.layer, VISIBLE_LAYER);
      game.newGame();
    });
  }

  #settingsButtonHanlde() {
    const button = this.bindById(SETTINGS_BUTTON_ID);
    button.addEventListener("click", () => {
      console.log("works");
    });
  }
}

export const mainMenu = new MainMenu();
