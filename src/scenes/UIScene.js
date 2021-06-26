import Phaser from "phaser";
import constants from "../constants";
import PauseMenu from "./PauseMenu";

export default class UIScene extends Phaser.Scene {
    pauseMenu;
    constructor() {
        super({ key: constants.scenes.ui });
    }

    preload() {
        this.spaceKey = this.input.keyboard.addKey("space");
    }

    create() {
        this.pauseMenu = new PauseMenu(this);
    }

    update() {
        this.handlePauseMenuUpdate();
    }

    handlePauseMenuUpdate() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.toggleModal();
        }
    }

    toggleModal() {
        if (this.pauseMenu.isOpen) {
            this.pauseMenu.hide();
            this.scene.resume(constants.scenes.game);
        } else {
            this.pauseMenu.show();
            this.scene.pause(constants.scenes.game);
        }
    }
}
