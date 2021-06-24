import Phaser from "phaser";
import constants from "../constants";
import PauseMenu from "../scenes/PauseMenu";

let player;
let stars;
let bombs;
let platforms;
let cursors;
let scoreText;
let leaderboard;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: constants.scenes.game });
        this.score = 0;
        this.gameOver = false;
        this.gameStart = true;
        this.pauseMenu = undefined;
    }

    init(data) {
        console.log(data);
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("ground", "assets/platform.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.image(constants.textures.uiPanel, "assets/ui-panel-2.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });

        this.spaceKey = this.input.keyboard.addKey("space");
    }

    create() {
        this.add.image(400, 300, "sky");

        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, "ground").setScale(2).refreshBody();

        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");

        player = this.physics.add.sprite(100, 450, "dude");

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

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

        // Keyboard inputs
        cursors = this.input.keyboard.createCursorKeys();

        // Add stars
        stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Add bombs
        bombs = this.physics.add.group();

        // Display the Score
        scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "32px",
            fill: "#000",
        });

        // collide the player and the stars with the plateforms
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);

        // check if the players overlaps with any stars
        this.physics.add.overlap(player, stars, collectStar, null, this);

        // check if the player has collided with any bombs
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        // add the menu
        this.pauseMenu = new PauseMenu(this);
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Controlling the player with the keyboard
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play("right", true);
        } else {
            player.setVelocityX(0);
            player.anims.play("turn");
        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }

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
}

function collectStar(player, star) {
    star.disableBody(true, true);

    // update the score
    this.score += 10;
    scoreText.setText("Score: " + this.score);

    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        const x =
            player.x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);

        const bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    this.gameOver = true;
}
