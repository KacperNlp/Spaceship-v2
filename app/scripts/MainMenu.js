import { BindToHtml } from "./BindToHtml.js";
import {
  visibilityOfLayers,
  HIDDEN_LAYER,
  VISIBLE_LAYER,
} from "./VisibilityOfLayers.js";
import { game } from "./Game.js";

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
  }

  #buttonsHandle() {
    this.#newGameButtonHandle();
    this.#settingsButtonHanlde();
  }

  #newGameButtonHandle() {
    const button = this.bindById(NEW_GAME_BUTTON_ID);
    button.addEventListener("click", () => {
      visibilityOfLayers.changeVisibilityOfLayer(this.layer, HIDDEN_LAYER);
      visibilityOfLayers.changeVisibilityOfLayer(game.layer, VISIBLE_LAYER);
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
