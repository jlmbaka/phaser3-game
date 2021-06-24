import Phaser from "phaser";
import constants from "../constants";
import PauseMenu from "./PauseMenu";

export default class Game extends Phaser.Scene {
    player;
    stars;
    bombs;
    platforms;
    cursors;
    scoreText;
    leaderboard;
    constructor() {
        super({ key: constants.scenes.game });
        this.score = 0;
        this.gameOver = false;
        this.gameStart = true;
        this.pauseMenu = undefined;
    }

    init(data) {
        console.log(data);
        // Keyboard inputs
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload() {
        this.spaceKey = this.input.keyboard.addKey("space");
    }

    create() {
        this.add.image(400, 300, "sky");
        this.createPlatform();
        this.createPlayer();
        this.createStars();
        this.createBombs();
        this.createScoreText();

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

        // add the menu
        this.pauseMenu = new PauseMenu(this);
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

    update() {
        if (this.gameOver) {
            this.displayGameOverText();
            return;
        }
        this.updatePlayerPosition();
        this.handlePauseMenuUpdate();
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

    handlePauseMenuUpdate() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            // toggle modal
            if (this.pauseMenu.isOpen) {
                this.pauseMenu.hide();
                // this.scene.resume();
            } else {
                this.pauseMenu.show();
                // this.scene.pause();
            }
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.updateScore();
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

    displayGameOverText() {
        // add a You Game Over! text
        const { width, height } = this.scale;
        this.add
            .text(width * 0.5, height * 0.5, "Game Over!", {
                fontSize: 48,
                color: "red",
            })
            .setOrigin(0.5);
    }
}
