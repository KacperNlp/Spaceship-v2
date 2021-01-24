import { BindToHtml } from "./BindToHtml.js";

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
      console.log("works");
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
