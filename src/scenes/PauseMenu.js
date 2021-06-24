import Phaser from "phaser";
import constants from "../constants";

export default class PauseMenu {
    container;
    isOpen = false;
    scene;
    constructor(scene) {
        this.scene = scene;
        const { width, height } = scene.scale;

        this.container = scene.add.container(width * 2, 50);

        const panel = scene.add
            .nineslice(
                0,
                0,
                width * 0.9,
                height * 0.9,
                constants.textures.uiPanel,
                0
            )
            .setOrigin(1, 0);

        // const text = scene.add.text(10, 10, "Menu", {
        //     color: "black",
        //     fontSize: 28,
        // });
        // this.container.add(text);
        this.container.add(panel);
    }

    show() {
        if (this.isOpen) {
            return;
        }
        const { width } = this.scene.scale;
        this.scene.tweens.add({
            targets: this.container,
            x: width - 50,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut,
        });
        this.isOpen = true;
    }

    hide() {
        if (!this.isOpen) {
            return;
        }
        const { width } = this.scene.scale;
        this.scene.tweens.add({
            targets: this.container,
            x: width * 2,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut,
        });
        this.isOpen = false;
    }
}
