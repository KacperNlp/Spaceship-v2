import { tagsGenerator } from "./TagsGenerator.js";
import { LIST_OF_CLASS } from "./Store.js";

export class ShipInStore {
  constructor({
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
  }) {
    this.product = {
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
    const { src } = this.product;

    const imgContainer = tagsGenerator.createTag("div");
    imgContainer.classList.add(image);

    const img = new Image();
    img.src = src;
    imgContainer.appendChild(img);

    return imgContainer;
  }

  #nameGenerator() {
    const { name } = this.product;
    const { nameClass } = LIST_OF_CLASS;

    const nameContainer = tagsGenerator.createTag("p");
    nameContainer.classList.add(nameClass);
    nameContainer.textContent = name;

    return nameContainer;
  }

  #statsGenerator() {
    const { statsContainerClass, statClass } = LIST_OF_CLASS;
    const { hp, speed, doubleShot, active } = this.product;

    const stats = [
      { txt: "HP: ", value: hp },
      { txt: "Speed: ", value: speed },
      { txt: "Double shot: ", value: doubleShot },
      { txt: "Active: ", value: active },
    ];

    const statsContainer = tagsGenerator.createTag("div");
    statsContainer.classList.add(statsContainerClass);

    for (let i = 0; i < stats.length; i++) {
      const statContainer = tagsGenerator.createTag("div");
      statContainer.classList.add(statClass);

      const textContainer = tagsGenerator.createTag("p");
      const valueContainer = tagsGenerator.createTag("p");

      textContainer.textContent = stats[i].txt;
      valueContainer.textContent = stats[i].value;

      statContainer.appendChild(textContainer);
      statContainer.appendChild(valueContainer);
      statsContainer.appendChild(statContainer);
    }

    return statsContainer;
  }

  #buttonGenerator() {
    const { globalButtonClass, storeButton } = LIST_OF_CLASS;
    const { active, unlocked, cost } = this.product;

    const button = tagsGenerator.createTag("button");
    button.setAttribute("class", `${globalButtonClass} ${storeButton}`);

    if (active && unlocked) {
      button.textContent = `You're using this ship!`;
    } else if (!active && unlocked) {
      button.textContent = "Take this!";
    } else if (!active && !unlocked) {
      button.textContent = `Buy! (cost: ${cost})`;
    }

    return button;
  }
}
