import { BindToHtml } from "./BindToHtml.js";
import { tagsGenerator } from "./TagsGenerator.js";

export const PRODUCTS_IN_STORE = {
  ships: [
    {
      tier: 1,
      hp: 3,
      speed: 6,
      doubleShot: false,
      unlocked: true,
      src: "/assets/player/tier4.png",
      cost: 0,
    },
    {
      tier: 2,
      hp: 4,
      speed: 10,
      doubleShot: false,
      unlocked: false,
      src: "/assets/player/tier5.png",
      cost: 500,
    },
    {
      tier: 3,
      hp: 5,
      speed: 15,
      doubleShot: true,
      unlocked: false,
      src: "/assets/player/tier2.png",
      cost: 1500,
    },
  ],
  allies: [
    {
      shipClass: "allies-fighter",
      shipExplosionClass: "allies-fighter--explosion",
      type: "fighter",
      size: 64,
      hp: 1,
      speed: 3,
      cost: 100,
      src: "/assets/allies/fighter.png",
    },
    {
      shipClass: "allies-destroyer",
      shipExplosionClass: "allies-destroyer--explosion",
      type: "fighter",
      size: 128,
      hp: 3,
      speed: 2,
      cost: 200,
      src: "/assets/allies/spaceship_enemy.png",
    },
  ],
  live: {
    cost: 100,
  },
};

const HEART_ICON = { fas: "fas", heart: "fa-heart" };
const LIST_OF_CLASS = {
  alliesName: "store__allies-name",
  globalButtonClass: "button",
  container: "store__container",
  image: "store__img",
  stats: "store__stats",
  stat: "store__stat",
  storeButton: "store__button",
  liveContainer: "store__live",
};
const LIVES_SECTION_ID = "store-lives";
const STORE_LAYER_ID = "store";
const PLAYER_ALLIES_SECTION_ID = "store-player-allies";
const PLAYER_SHIPS_SECTION_ID = "store-player-ships";

class Store extends BindToHtml {
  constructor() {
    super(STORE_LAYER_ID);
  }

  generateStore() {
    const { ships, allies, live } = PRODUCTS_IN_STORE;

    this.#generateSection(ships, PLAYER_SHIPS_SECTION_ID);
    this.#generateSection(allies, PLAYER_ALLIES_SECTION_ID);
    this.#generateLivesSection(live);
  }

  #generateSection(array, sectionId) {
    const {
      alliesName,
      globalButtonClass,
      container,
      image,
      stats,
      stat,
      storeButton,
    } = LIST_OF_CLASS;
    const section = this.bindById(sectionId);
    section.innerHTML = "";

    array.forEach((element) => {
      const mainContainer = tagsGenerator.createTag("div");
      mainContainer.classList.add(container);

      const arrayWithStats = [
        [element.hp, "HP: "],
        [element.speed, "Speed: "],
        [element.doubleShot, "Double shot: "],
      ];

      const imageContainer = this.#imageGenerator(element.src);
      imageContainer.classList.add(image);
      mainContainer.appendChild(imageContainer);

      if (!!element.type) {
        const elementName = tagsGenerator.createTag("p");
        elementName.classList.add(alliesName);
        mainContainer.appendChild(elementName);
      }

      const statsContainer = this.#statsGenerator(arrayWithStats, stat);
      statsContainer.classList.add(stats);
      mainContainer.appendChild(statsContainer);

      const button = tagsGenerator.createTag("button");
      button.setAttribute("class", `${globalButtonClass} ${storeButton}`);
      if (element.unlocked) {
        button.textContent = "Take it!";
      } else {
        button.textContent = `Buy! (cost: ${element.cost})`;
      }
      mainContainer.appendChild(button);
      section.appendChild(mainContainer);
    });
  }

  #generateLivesSection(live) {
    const { globalButtonClass, storeButton, liveContainer } = LIST_OF_CLASS;
    const { cost } = live;

    const liveSection = this.bindById(LIVES_SECTION_ID);
    liveSection.innerHTML = "";

    const container = tagsGenerator.createTag("div");
    container.classList.add(liveContainer);

    const heartIcon = tagsGenerator.createTag("p");
    heartIcon.classList.add(HEART_ICON.fas);
    heartIcon.classList.add(HEART_ICON.heart);

    const button = tagsGenerator.createTag("button");
    button.setAttribute("class", `${globalButtonClass} ${storeButton}`);
    button.textContent = `Buy! (cost: ${cost})`;

    container.appendChild(heartIcon);
    container.appendChild(button);
    liveSection.appendChild(container);
  }

  #imageGenerator(src) {
    const imageContainer = tagsGenerator.createTag("div");
    const img = new Image();
    img.src = src;
    imageContainer.appendChild(img);

    return imageContainer;
  }

  #statsGenerator(arrayWithStats, classForStat) {
    const statsContainer = tagsGenerator.createTag("div");

    for (let i = 0; i < arrayWithStats.length; i++) {
      const statContainer = tagsGenerator.createTag("div");
      statContainer.classList.add(classForStat);
      const statName = tagsGenerator.createTag("p");
      const statValue = tagsGenerator.createTag("p");

      statName.textContent = arrayWithStats[i][1];
      statValue.textContent = arrayWithStats[i][0];

      statContainer.appendChild(statName);
      statContainer.appendChild(statValue);
      statsContainer.appendChild(statContainer);
    }

    return statsContainer;
  }
}

export const store = new Store();
