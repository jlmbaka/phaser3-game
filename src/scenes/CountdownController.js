export default class CountdownController {
    /** @type {Phaser.Scene} */
    scene;

    /** @type {Phaser.Time.TimerEvent} */
    timerEvent;

    /** @type {Phaser.GameObjects.Text} */
    label;

    duration = 0;

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Text} label
     */
    constructor(scene, label) {
        this.scene = scene;
        this.label = label;
    }

    /**
     * @param {() => void} callback
     * @param {number} duration
     */
    start(callback, duration = 45000) {
        this.stop();
        this.duration = duration;
        this.timerEvent = this.createTimerEvent(callback, duration);
    }

    createTimerEvent(callback, duration) {
        return this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                this.label.text = "0";

                this.stop();
                if (callback) {
                    callback();
                }
            },
        });
    }

    stop() {
        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = undefined;
        }
    }

    update(bonus = 0) {
        if (!this.timerEvent || this.duration <= 0) {
            return;
        }
        // compute the current time
        const elapsed = this.timerEvent.getElapsed();
        const remaining = this.duration - elapsed;
        const seconds = remaining / 1000;
        // update the label
        this.label.text = seconds.toFixed(2);
    }
}
