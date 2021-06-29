import Phaser from "phaser";
import constants from "../constants";
import CountdownController from "./CountdownController";

export default class Game extends Phaser.Scene {
    player;
    stars;
    bombs;
    platforms;
    cursors;
    scoreText;
    leaderboard;
    /** @type {CountdownController} */
    countdown;

    constructor() {
        super({ key: constants.scenes.game });
        this.score = 0;
        this.gameOver = false;
        this.gameStart = true;
    }

    init(data) {
        console.log(data);
        // Keyboard inputs
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload() {}

    create() {
        // this.add.image(400, 300, "sky");
        this.add.image(400, 300, "landscape");
        this.createPlatform();
        this.createPlayer();
        this.createStars();
        this.createBombs();
        this.createScoreText();
        this.createCountDown();

        // collide the player and the stars with the plateforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        // check if the player has collided with any bombs
        this.physics.add.collider(
            this.player,
            this.bombs,
            this.handlePlayerBombCollide,
            null,
            this
        );

        // check if the players overlaps with any stars
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            null,
            this
        );

        // launch the menu
        this.scene.launch(constants.scenes.ui);
    }

    createPlatform() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 450, "dude");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    }

    createBombs() {
        this.bombs = this.physics.add.group();
    }

    createStars() {
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    }

    createScoreText() {
        // Display the Score
        this.scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "32px",
            fill: "#000",
        });
    }

    createCountDown() {
        const { width } = this.scale;
        const timerLabel = this.add
            .text(width * 0.5, 50, "45", { fontSize: 48 })
            .setOrigin(0.5);
        this.countdown = new CountdownController(this, timerLabel);
        this.countdown.start(this.handleCountdownFinished.bind(this), 15000);
    }

    handleCountdownFinished() {
        // disable player
        // this.player.active = false;
        // this.player.setVelocity(0, 0);
        this.physics.pause();
        // create a GameOver Message
        this.displayGameOverText("Time up!");
    }

    update() {
        if (this.gameOver) {
            this.displayGameOverText();
            return;
        }
        this.updatePlayerPosition();
        // TODO: increase time by 10 when start is collected
        this.countdown.update();
    }

    updatePlayerPosition() {
        // Controlling the player with the keyboard
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.updateScore();
        const currentDuration = this.countdown.duration;
        const timeBonus = 1000;
        this.countdown.start(
            this.handleCountdownFinished.bind(this),
            currentDuration + timeBonus
        );
        if (this.stars.countActive(true) === 0) {
            this.createNewBatchOfStars(player);
        }
    }

    updateScore() {
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);
    }

    createNewBatchOfStars(player) {
        this.stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        const x =
            player.x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);

        const bomb = this.bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }

    handlePlayerBombCollide(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");
        this.gameOver = true;
    }

    displayGameOverText(message = "Game Over!") {
        // add a You Game Over! text
        const { width, height } = this.scale;
        this.add
            .text(width * 0.5, height * 0.5, message, {
                fontSize: 48,
                color: "red",
            })
            .setOrigin(0.5);
    }
}
