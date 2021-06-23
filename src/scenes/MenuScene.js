import Phaser from "phaser";
import constants from "../constants";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: constants.scenes.menu });
    }

    init(data) {}
    preload() {}
    create() {
        this.scene.start(constants.scenes.game, "Hello from menu scene");
    }
    update() {}
}
