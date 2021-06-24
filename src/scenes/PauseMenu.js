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
                height * 0.8,
                constants.textures.uiPanel,
                0
            )
            .setOrigin(1, 0);

        const text = scene.add
            .text(
                -width / 2 + 56,
                height / 2 - 56,
                "Paused.\nPress Space to resume",
                {
                    color: "white",
                    fontSize: 28,
                    align: "center",
                }
            )
            .setOrigin(0.5);

        this.container.add(panel);
        this.container.add(text);
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
