export class GameState {
  #lives = 300;
  #points = 0;
  #diamonds = 0;
  #timeToRenderNewEnemy = 2000;
  #requireScoreToNextLevel = 50;
  #numberOfDestroyedEnemies = 0;
  #numberOfFiredMissiles = 0;

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
    if (this.#timeToRenderNewEnemy > 300) {
      this.#timeToRenderNewEnemy -= 100;
    }
  }

  get requireScoreToNextLevel() {
    return this.#requireScoreToNextLevel;
  }

  updateRequireScoreToNextLevel() {
    this.#requireScoreToNextLevel += 100;
  }

  increaseNumberOfDestroyedEnemies() {
    this.#numberOfDestroyedEnemies++;
  }

  getNumberOfDestroyedEnemies() {
    return this.#numberOfDestroyedEnemies;
  }

  increaseNumberOfFiredMissiles() {
    this.#numberOfFiredMissiles++;
  }

  getNumberOfFiredMissiles() {
    return this.#numberOfFiredMissiles;
  }
}
