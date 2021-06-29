import Phaser from "phaser";
import constants from "../constants";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: constants.scenes.preloader });
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("landscape", "assets/landscape-2.png");
        this.load.image("ground", "assets/platform.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.image(constants.textures.uiPanel, "assets/ui-panel-2.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create() {
        // create animations
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        // start game scen
        this.scene.start(constants.scenes.game);
    }
}
