import { BindToHtml } from "./BindToHtml.js";
import { game } from "./Game.js";
import { mainMenu } from "./MainMenu.js";
import {
  HIDDEN_LAYER,
  visibilityOfLayers,
  VISIBLE_LAYER,
} from "./VisibilityOfLayers.js";

const MESSAGE_CLOSE_BUTTON_ID = "message-button";
const MESSAGE_INFO_ABOUT_BREAK_RECORD_ID = "record-message";
const MESSAGE_LAYER_ID = "message";
const MESSAGE_NUMBER_OF_DESTROYED_ENEMIES_ID = "message-destroyed-enemies";
const MESSAGE_NUMBER_OF_FIRED_MISSILES_ID = "message-fired-missiles";
const MESSAGE_SCORE_ID = "message-score";

class Message extends BindToHtml {
  constructor() {
    super(MESSAGE_LAYER_ID);
  }

  setMessage(score, destroyedEnemies, firedMissiles, recordIsBroken) {
    this.#setTextAboutRecord(recordIsBroken);
    this.#setStats(score, MESSAGE_SCORE_ID);
    this.#setStats(destroyedEnemies, MESSAGE_NUMBER_OF_DESTROYED_ENEMIES_ID);
    this.#setStats(firedMissiles, MESSAGE_NUMBER_OF_FIRED_MISSILES_ID);
    this.#handleCloseButton();
  }

  #setTextAboutRecord(recordIsBroken) {
    const messageAboutRecore = this.bindById(
      MESSAGE_INFO_ABOUT_BREAK_RECORD_ID
    );
    if (recordIsBroken) {
      messageAboutRecore.classList.remove("hidden");
    } else {
      messageAboutRecore.classList.add("hidden");
    }
  }

  #setStats(score, containerId) {
    const container = this.bindById(containerId);
    container.textContent = score;
  }

  #handleCloseButton() {
    const button = this.bindById(MESSAGE_CLOSE_BUTTON_ID);
    button.addEventListener("click", () => {
      mainMenu.setHighestScore();

      visibilityOfLayers.changeVisibilityOfLayer(this.layer, HIDDEN_LAYER);
      visibilityOfLayers.changeVisibilityOfLayer(game.layer, HIDDEN_LAYER);
      visibilityOfLayers.changeVisibilityOfLayer(mainMenu.layer, VISIBLE_LAYER);
    });
  }
}

export const message = new Message();
