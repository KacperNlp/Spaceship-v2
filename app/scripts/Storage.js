const KEY_NAME_FOR_STORAGE = "highestScore";

class Storage {
  constructor() {
    if (!localStorage.length) {
      this.setHighestScore(0);
    }
  }

  setHighestScore(score) {
    localStorage.setItem(
      KEY_NAME_FOR_STORAGE,
      JSON.stringify({ score: score })
    );
  }

  getHighestScore() {
    const highestScore = localStorage.getItem(KEY_NAME_FOR_STORAGE);
    const { score } = JSON.parse(highestScore);

    return score;
  }
}

export const storage = new Storage();
