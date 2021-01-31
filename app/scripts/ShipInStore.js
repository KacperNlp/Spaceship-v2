import { tagsGenerator } from "./TagsGenerator.js";
import { LIST_OF_CLASS, store, STORE_SECTIONS } from "./Store.js";
import { game } from "./Game.js";
import { allies } from "./Allies.js";
import { gameAudio } from "./GameAudio.js";

export class ShipInStore {
  constructor(
    {
      shipClass,
      explosionClass,
      name,
      hp,
      size,
      speed,
      doubleShot,
      unlocked,
      active,
      cost,
      src,
    },
    section
  ) {
    this.button = null;
    this.statsContainer = null;
    this.props = {
      shipClass,
      explosionClass,
      name,
      hp,
      size,
      speed,
      doubleShot,
      unlocked,
      active,
      cost,
      src,
    };
    this.container;
    this.sectionInStore = section;

    this.#containerInitialSettings();
  }

  #containerInitialSettings() {
    const { container } = LIST_OF_CLASS;
    this.container = tagsGenerator.createTag("div");
    this.container.classList.add(container);

    this.#init();
  }

  #init() {
    const imageContainer = this.#imageGenerator();
    const name = this.#nameGenerator();
    const statsContainer = this.#statsGenerator();
    const button = this.#buttonGenerator();

    this.container.appendChild(imageContainer);
    this.container.appendChild(name);
    this.container.appendChild(statsContainer);
    this.container.appendChild(button);
  }

  #imageGenerator() {
    const { image } = LIST_OF_CLASS;
    const { src } = this.props;

    const imgContainer = tagsGenerator.createTag("div");
    imgContainer.classList.add(image);

    const img = new Image();
    img.src = src;
    imgContainer.appendChild(img);

    return imgContainer;
  }

  #nameGenerator() {
    const { name } = this.props;
    const { nameClass } = LIST_OF_CLASS;

    const nameContainer = tagsGenerator.createTag("p");
    nameContainer.classList.add(nameClass);
    nameContainer.textContent = name;

    return nameContainer;
  }

  #statsGenerator() {
    const { statsContainerClass } = LIST_OF_CLASS;

    this.statsContainer = tagsGenerator.createTag("div");
    this.statsContainer.classList.add(statsContainerClass);

    this.generateStats();

    return this.statsContainer;
  }

  #buttonGenerator() {
    const { globalButtonClass, storeButton } = LIST_OF_CLASS;
    const { active, unlocked, cost } = this.props;

    this.button = tagsGenerator.createTag("button");
    this.button.setAttribute("class", `${globalButtonClass} ${storeButton}`);

    if (active && unlocked) {
      this.button.textContent = `You're using this ship!`;
    } else if (!active && unlocked) {
      this.button.textContent = "Take this!";
    } else if (!active && !unlocked) {
      this.button.textContent = `Buy! (cost: ${cost})`;
    }

    this.button.addEventListener("click", this.#buttonHandle);

    return this.button;
  }

  #buttonHandle = () => {
    const { player: playerSection, allies: alliesSection } = STORE_SECTIONS;
    const playerWallet = game.gameState.diamonds;

    if (playerSection === this.sectionInStore) {
      this.#hanldeForPlayerSection(playerWallet);
    } else if (alliesSection === this.sectionInStore) {
      this.#handleForAlliesSection(playerWallet);
    }
  };

  #hanldeForPlayerSection(wallet) {
    const { active, unlocked, cost, src, hp, speed, doubleShot } = this.props;

    if (!active && !unlocked && wallet >= cost) {
      this.props.unlocked = true;
      game.gameState.decreaseDiamonds(cost);
      store.updateStore();
    } else if (!active && unlocked) {
      this.props.active = true;
      gameAudio.playAlliesArrive();

      store.playerShipsArray.forEach((ship) => {
        const { name } = ship.props;

        if (name !== this.props.name) {
          ship.props.active = false;
        }

        store.updateStore();
      });

      game.changeTypeOfShip(src, speed, doubleShot, hp);
    }
  }

  #handleForAlliesSection(wallet) {
    const { name, cost } = this.props;

    if (wallet >= cost) {
      game.gameState.decreaseDiamonds(cost);
      gameAudio.playAlliesArrive();
      allies.createAlly(name);
    }
  }

  generateStats() {
    const { statClass } = LIST_OF_CLASS;
    const { hp, speed, doubleShot, active } = this.props;

    const stats = [
      { txt: "HP: ", value: hp },
      { txt: "Speed: ", value: speed },
      { txt: "Double shot: ", value: doubleShot },
      { txt: "Active: ", value: active },
    ];

    for (let i = 0; i < stats.length; i++) {
      const statContainer = tagsGenerator.createTag("div");
      statContainer.classList.add(statClass);

      const textContainer = tagsGenerator.createTag("p");
      const valueContainer = tagsGenerator.createTag("p");

      textContainer.textContent = stats[i].txt;
      valueContainer.textContent = stats[i].value;

      statContainer.appendChild(textContainer);
      statContainer.appendChild(valueContainer);
      this.statsContainer.appendChild(statContainer);
    }
  }
}
