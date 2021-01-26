export class GameState {
  #lives = 3;
  #points = 0;
  #diamonds = 0;
  #timeToRenderNewEnemy = 2000;
  #requireScoreToNextLevel = 50;

  get lives() {
    return this.#lives;
  }

  set lives(value) {
    this.#lives += value;
  }

  decreaseLives() {
    this.#lives--;
  }

  increaseLives() {
    this.#lives++;
  }

  get points() {
    return this.#points;
  }

  increasePoints(scoredPoints) {
    this.#points += scoredPoints;
  }

  get diamonds() {
    return this.#diamonds;
  }

  decreaseDiamonds(value) {
    this.#diamonds -= value;
  }

  increaseDiamonds(value) {
    this.#diamonds += value;
  }

  get timeToRenderNewEnemy() {
    return this.#timeToRenderNewEnemy;
  }

  decreaseTimeToRenderNewEnemy() {
    if (this.#timeToRenderNewEnemy > 400) {
      this.#timeToRenderNewEnemy -= 100;
    }
  }

  get requireScoreToNextLevel() {
    return this.#requireScoreToNextLevel;
  }

  updateRequireScoreToNextLevel() {
    this.#requireScoreToNextLevel += 100;
  }
}
