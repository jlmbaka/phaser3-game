import Phaser from "phaser";
import constants from "../constants";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: constants.scenes.menu });
        this.viewMenuCount = 0;
    }

    init(data) {
        console.log(data);
        this.score = data.score;
    }

    preload() {}

    create() {
        //init input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Text
        const menuMessage =
            this.viewMenuCount > 0
                ? `Game Paused\nScore:${this.score}\n\nPress Space to resume`
                : "Start Game";
        this.menuText = this.add.text(16, 16, menuMessage, {
            fontSize: "32px",
            fill: "#fff",
        });
    }

    update() {
        if (this.cursors.space.isDown) {
            this.scene.start(constants.scenes.game);
        }
    }
}
