export class GameState {
  #lives = 3;
  #points = 0;
  #diamonds = 0;

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
}
