import Phaser from "phaser";
import { Plugin as NineSlicePlugin } from "phaser3-nineslice";

import MenuScene from "./src/scenes/MenuScene";
import GameScene from "./src/scenes/GameScene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    plugins: {
        global: [NineSlicePlugin.DefaultCfg],
    },
    scene: [MenuScene, GameScene],
};

const game = new Phaser.Game(config);
export default game;
