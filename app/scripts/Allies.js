import { PRODUCTS_IN_STORE } from "../data/storeProducts.js";
import { Ally } from "./Ally.js";

class Allies {
  constructor() {
    this.alliesMissiles = [];
    this.alliesShips = [];
  }

  createAlly(type) {
    const { allies } = PRODUCTS_IN_STORE;
    let allyProps = null;

    allies.forEach((ally) => {
      const { name } = ally;

      if (name === type) {
        allyProps = ally;
      }
    });

    const ally = new Ally(allyProps);
    this.alliesShips.push(ally);
  }
}

export const allies = new Allies();
