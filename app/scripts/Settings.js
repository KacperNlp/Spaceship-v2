import { BindToHtml } from "./BindToHtml.js";
import { gameAudio } from "./GameAudio.js";
import { HIDDEN_LAYER, visibilityOfLayers } from "./VisibilityOfLayers.js";

const MAX_VALUE_OF_BAR = 100;
const SETTINGS_BUTTON_ID = "settings-close-button";
const SETTINGS_GAME_SOUND_BAR_ID = "game-sounds";
const SETTINGS_MUSIC_BAR_ID = "music";
const SETTINGS_LAYER_ID = "settings";
const TYPE_OF_BARS = {
  music: "music",
  gameSounds: "game-sounds",
};

class Settings extends BindToHtml {
  #gameSoundsVolume = 0;
  #musicVolume = 0;

  constructor() {
    super(SETTINGS_LAYER_ID);
    this.#init();
  }

  #init() {
    this.#handleChangesInSettings();
    this.#handleSettingsButton();
  }

  #handleChangesInSettings() {
    const { music, gameSounds } = TYPE_OF_BARS;
    this.#handleSettingsBar(SETTINGS_GAME_SOUND_BAR_ID, gameSounds);
    this.#handleSettingsBar(SETTINGS_MUSIC_BAR_ID, music);
  }

  #handleSettingsButton() {
    const button = this.bindById(SETTINGS_BUTTON_ID);
    button.addEventListener("click", () => {
      visibilityOfLayers.changeVisibilityOfLayer(this.layer, HIDDEN_LAYER);
    });
  }

  #handleSettingsBar(id, type) {
    const bar = this.bindById(id);
    bar.addEventListener("change", (event) => this.#changeVolume(event, type));
  }

  #changeVolume(event, type) {
    const { music, gameSounds } = TYPE_OF_BARS;
    const { value } = event.target;

    const volume = value / MAX_VALUE_OF_BAR;

    if (music === type) {
      this.#musicVolume = volume;
      gameAudio.changeMusicVolume(volume);
    } else if (type === gameSounds) {
      this.#gameSoundsVolume = volume;
      gameAudio.changeGameSound(volume);
    }
  }

  get gameSoundsVolume() {
    return this.#gameSoundsVolume;
  }

  get musicVolume() {
    return this.#musicVolume;
  }
}

export const settings = new Settings();
