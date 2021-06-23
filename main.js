import Phaser from "phaser";
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
    scene: [MenuScene, GameScene],
};

const game = new Phaser.Game(config);
