import { BindToHtml } from "./BindToHtml.js";
import { tagsGenerator } from "./TagsGenerator.js";
import { ShipInStore } from "./ShipInStore.js";
import { PRODUCTS_IN_STORE } from "../data/storeProducts.js";
import { HIDDEN_LAYER, visibilityOfLayers } from "./VisibilityOfLayers.js";

const CLOSE_BUTTON_ID = "close-store";
const HEART_ICON = { fas: "fas", heart: "fa-heart" };
export const LIST_OF_CLASS = {
  nameClass: "store__name",
  globalButtonClass: "button",
  container: "store__container",
  image: "store__img",
  statsContainerClass: "store__stats",
  statClass: "store__stat",
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
    this.playerShipsArray = [];
    this.alliesShipsArray = [];
  }

  generateStore() {
    const { ships, allies, live } = PRODUCTS_IN_STORE;

    this.#generateSection(
      ships,
      PLAYER_SHIPS_SECTION_ID,
      this.playerShipsArray
    );
    this.#generateSection(
      allies,
      PLAYER_ALLIES_SECTION_ID,
      this.alliesShipsArray
    );
    this.#generateLivesSection(live);
    this.#handleCloseStoreButton();
  }

  #generateSection(arrayFromData, sectionId, arrayForProducts) {
    const sectionContainer = this.bindById(sectionId);
    //clear html
    while (sectionContainer.firstChild) {
      sectionContainer.removeChild(sectionContainer.lastChild);
    }
    arrayForProducts.length = 0; //clear array

    arrayFromData.forEach((ship) => {
      const shipInStore = new ShipInStore(ship);
      sectionContainer.appendChild(shipInStore.container);

      arrayForProducts.push(shipInStore);
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

  #handleCloseStoreButton() {
    const button = this.bindById(CLOSE_BUTTON_ID);
    button.addEventListener("click", () => {
      visibilityOfLayers.changeVisibilityOfLayer(this.layer, HIDDEN_LAYER);
    });
  }
}

export const store = new Store();
