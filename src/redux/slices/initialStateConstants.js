import { current } from "@reduxjs/toolkit";

export const initialRoster = {
  activeRoster: {},
  collection: {
    batman: {
      id: "batman",
      name: "Batman",
      icon: "/images/sprites/batman/batmanDown2.png",
      displayImg: "/images/sprites/batman/batmanDisplayImg.png",
      spriteSheet: "/images/sprites/batman/batmanSpriteSheet.png",
      x: 48,
      y: 0,
      maxStats: { dmg: 5, hp: 20, moveRange: 2 },
    },
    robin: {
      id: "robin",
      name: "Robin",
      icon: "/images/sprites/robin/robinDown2.png",
      displayImg: "/images/sprites/robin/robinDisplayImg.png",
      spriteSheet: "/images/sprites/robin/robinSpriteSheet.png",
      x: 48,
      y: 0,

      maxStats: { dmg: 5, hp: 20, moveRange: 2 },
    },
    nightwing: {
      id: "nightwing",
      name: "Nightwing",
      icon: "/images/sprites/nightwing/nightwingDown2.png",
      displayImg: "/images/sprites/nightwing/nightwingDisplayImg.png",
      spriteSheet: "/images/sprites/nightwing/nightwingSpriteSheet.png",
      x: 48,
      y: 0,

      maxStats: { dmg: 7, hp: 20, moveRange: 3 },
    },
    superman: {
      id: "superman",
      name: "Superman",
      icon: "/images/sprites/superman/supermanDown2.png",
      displayImg: "/images/sprites/superman/supermanDisplayImg.png",
      spriteSheet: "/images/sprites/superman/supermanSpriteSheet.png",
      x: 48,
      y: 0,

      maxStats: { dmg: 5, hp: 20, moveRange: 2 },
    },
    drMultiverse: {
      id: "drMultiverse",
      name: "Dr. Multiverse",
      icon: "/images/sprites/drMultiverse/drMultiverseDown2.png",
      displayImg: "/images/sprites/drMultiverse/drMultiverseDisplayImg.png",
      spriteSheet: "/images/sprites/drMultiverse/drMultiverseSpriteSheet.png",
      x: 48,
      y: 0,

      maxStats: { dmg: 5, hp: 20, moveRange: 2 },
    },
    penguin: {
      id: "penguin",
      name: "Penguin",
      icon: "/images/sprites/penguin/penguinDown2.png",
      displayImg: "/images/sprites/penguin/penguinDisplayImg.png",
      spriteSheet: "/images/sprites/penguin/penguinSpriteSheet.png",
      x: 48,
      y: 0,

      maxStats: { dmg: 5, hp: 20, moveRange: 2 },
    },
    twoFace: {
      id: "twoFace",
      name: "Two-Face",
      icon: "/images/sprites/twoFace/twoFaceDown2.png",
      displayImg: "/images/sprites/twoFace/twoFaceDisplayImg.png",
      spriteSheet: "/images/sprites/twoFace/twoFaceSpriteSheet.png",
      x: 48,
      y: 0,

      maxStats: { dmg: 5, hp: 20, moveRange: 2 },
    },
  },
};
