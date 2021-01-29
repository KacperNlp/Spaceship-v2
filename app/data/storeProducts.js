export const PRODUCTS_IN_STORE = {
  ships: [
    {
      shipClass: null,
      explosionClass: null,
      name: "XIJN",
      size: 64,
      hp: 3,
      speed: 6,
      doubleShot: false,
      unlocked: true,
      active: true,
      cost: 0,
      src: "/assets/player/tier4.png",
    },
    {
      shipClass: null,
      explosionClass: null,
      name: "Eagle",
      size: 64,
      hp: 4,
      speed: 10,
      doubleShot: false,
      unlocked: false,
      active: false,
      cost: 500,
      src: "/assets/player/tier5.png",
    },
    {
      shipClass: null,
      explosionClass: null,
      name: "Creep",
      size: 64,
      hp: 5,
      speed: 15,
      doubleShot: true,
      unlocked: false,
      active: false,
      cost: 1500,
      src: "/assets/player/tier2.png",
    },
  ],
  allies: [
    {
      shipClass: "allies-fighter",
      explosionClass: "allies-fighter--explosion",
      name: "fighter",
      size: 64,
      hp: 1,
      speed: 3,
      doubleShot: false,
      unlocked: false,
      active: false,
      cost: 50,
      src: "/assets/allies/fighter.png",
    },
    {
      shipClass: "allies-destroyer",
      explosionClass: "allies-destroyer--explosion",
      name: "destroyer",
      size: 128,
      hp: 3,
      speed: 2,
      doubleShot: true,
      unlocked: false,
      active: false,
      cost: 100,
      src: "/assets/allies/spaceship_enemy.png",
    },
  ],
  live: {
    cost: 100,
  },
};
