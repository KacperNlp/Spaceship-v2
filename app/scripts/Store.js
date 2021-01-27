import { BindToHtml } from "./BindToHtml";

export const PRODUCTS_IN_STORE = {
  ships: [
    {
      tier: 1,
      lives: 3,
      speed: 6,
      doubleShot: false,
      unlocked: true,
      src: "/assets/player/tier4.png",
      cost: 0,
    },
    {
      tier: 2,
      lives: 4,
      speed: 10,
      doubleShot: false,
      unlocked: false,
      src: "/assets/player/tier4.png",
      cost: 500,
    },
    {
      tier: 3,
      lives: 5,
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
    },
    {
      shipClass: "allies-destroyer",
      shipExplosionClass: "allies-destroyer--explosion",
      type: "fighter",
      size: 128,
      hp: 3,
      speed: 2,
      cost: 200,
    },
  ],
  live: {
    cost: 100,
  },
};
const STORE_LAYER_ID = "";

class Store extends BindToHtml {
  constructor() {
    super(STORE_LAYER_ID);
  }
}

export const store = new Store();
