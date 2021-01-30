class Settings {
  #gameSoundsVolume = 0.3;
  #musicVolume = 0.3;

  get gameSoundsVolume() {
    return this.#gameSoundsVolume;
  }

  get musicVolume() {
    return this.#musicVolume;
  }
}

export const settings = new Settings();
