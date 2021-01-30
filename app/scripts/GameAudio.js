import { TYPE_OF_ENEMIES } from "./Enemies.js";
import { settings } from "./Settings.js";

const ALARM_SRC = "/assets/sounds/alarm.wav";
const ALLIES_ARRIVE_SOUND_SRC = "/assets/sounds/levelUpSound.wav";
const DIAMONDS_SOUND_SRC = "/assets/sounds/coinSound.wav";
const EXPLOSIONS = {
  small: "/assets/sounds/fighterExplosion.wav",
  medium: "/assets/sounds/destroyerExplosion.wav",
};
const LOST_LIVE_SOUND_SRC = "/assets/sounds/mixkit-robotic-glitch-1035.wav";
const MUSIC_SRC = "/assets/sounds/Sky Scraper - Geographer.mp3";
const SOUND_FOR_THE_END_GAME_SRC =
  "/assets/sounds/Dizzy (Sting) - Max Surla_Media Right Productions.mp3";

class GameAudio {
  constructor() {
    this.alarm = null;
    this.alliesArriveSound = null;
    this.bacgroundMusic = null;
    this.bombExplosion = null;
    this.bigExplosion = null;
    this.diamondsSound = null;
    this.lostLiveSound = null;
    this.mediumExplosion = null;
    this.smallExplosion = null;
    this.soundForTheEndOfGame = null;

    this.#initSounds();
  }

  #initSounds() {
    const { medium, small } = EXPLOSIONS;

    this.alarm = this.#loadAudio(ALARM_SRC);
    this.alliesArriveSound = this.#loadAudio(ALLIES_ARRIVE_SOUND_SRC);
    this.bacgroundMusic = this.#loadAudio(MUSIC_SRC);
    this.bombExplosion = this.#loadAudio(small);
    this.diamondsSound = this.#loadAudio(DIAMONDS_SOUND_SRC);
    this.lostLiveSound = this.#loadAudio(LOST_LIVE_SOUND_SRC);
    this.mediumExplosion = this.#loadAudio(medium);
    this.smallExplosion = this.#loadAudio(small);
    this.soundForTheEndOfGame = this.#loadAudio(SOUND_FOR_THE_END_GAME_SRC);

    this.playMusic();
  }

  #loadAudio(src) {
    const audio = new Audio();
    audio.src = src;
    audio.volume = settings.gameSoundsVolume;

    return audio;
  }

  changeGameSound(volume) {
    this.bombExplosion.volume = volume;
    this.lostLiveSound = volume;
    this.diamondsSound.volume = volume;
    this.mediumExplosion.volume = volume;
    this.smallExplosion.volume = volume;
    this.soundForTheEndOfGame.volume = volume;
  }

  changeMusicVolume(volume) {
    this.bacgroundMusic.volume = volume;
  }

  playMusic() {
    this.bacgroundMusic.play();
    this.bacgroundMusic.loop = true;
  }

  pauseMusic() {
    this.bacgroundMusic.pause();
  }

  playAlarm() {
    this.#playGameSound(this.alarm);
  }

  playAlliesArrive() {
    this.#playGameSound(this.alliesArriveSound);
  }

  playBombExplosion() {
    this.#playGameSound(this.bombExplosion);
  }

  explosionSound(typeOfDestryedShip) {
    const {
      fighter,
      destroyer,
      bomber,
      commanderShip,
      starDestroyer,
    } = TYPE_OF_ENEMIES;

    if (typeOfDestryedShip === fighter || typeOfDestryedShip === bomber) {
      this.#playGameSound(this.smallExplosion);
    } else if (
      typeOfDestryedShip === destroyer ||
      typeOfDestryedShip === commanderShip ||
      typeOfDestryedShip === starDestroyer
    ) {
      this.#playGameSound(this.mediumExplosion);
    }
  }

  playDiamondsSound() {
    this.#playGameSound(this.diamondsSound);
  }

  playLostLiveSound() {
    this.#playGameSound(this.lostLiveSound);
  }

  playSoundForTheEndGame() {
    this.#playGameSound(this.soundForTheEndOfGame);
  }

  #playGameSound(type) {
    type.play();
  }
}

export const gameAudio = new GameAudio();
