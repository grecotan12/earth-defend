const gameState = {
    hp: 10,
    score: 0,
    count: 0,
    speed: 200,
    bulletSpeed: 400,
}

function preload() {
    const randomNum = Math.floor(Math.random() * 3);
    switch (randomNum) {
        case 0:
            this.load.image('bg', 'assets/game_background_1.png');
            break;
        case 1:
            this.load.image('bg', 'assets/game_background_2.png');
            break;
        case 2: 
            this.load.image('bg', 'assets/game_background_3.png');
            break;
        default:
            break;
    }
    this.load.image('player', 'assets/player.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('wall', 'assets/wall.png');
}

function create() {
    gameState.bg = this.add.image(400, 275, 'bg').setScale(0.5);
    const platforms = this.physics.add.staticGroup();
    platforms.create(10, 275, 'wall').setScale(1, 6).refreshBody().setAlpha(0);
    gameState.player = this.physics.add.sprite(100, 100, 'player').setScale(0.25);
    gameState.player.setCollideWorldBounds(true);
    gameState.hpText = this.add.text(100, 100, `HP:${gameState.hp}`, {fill: '#ff0000'});
    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.bullet = this.physics.add.group();
    gameState.gameText = this.add.text(650, 25, `Score: ${gameState.score}`, {
        fill: "#000000",
        fontSize: 24
    });
    gameState.countText = this.add.text(400, 25, `Invaders: ${gameState.count}`, {
        fill: "#000000",
        fontSize: 24
    });
    gameState.drones = this.physics.add.group();
    function droneGen() {
        const xCoor = (Math.random() * 500) + 400;
        const yCoor = (Math.random() * 400) + 100;
        if (gameState.score > 500) {
            gameState.drones.create(xCoor, yCoor, 'enemy').setGravityX(-400);
        } else {
            gameState.drones.create(xCoor, yCoor, 'enemy').setGravityX(-200);
        }
    }
    
    const droneGenLoop = this.time.addEvent({
        delay: 1000,
        callback: droneGen,
        callbackScope: this,
        loop: true,
    });

    this.physics.add.collider(gameState.bullet, gameState.drones, (bullet, drone) => {
        bullet.destroy();
        drone.destroy();
        gameState.score += 10;
        gameState.gameText.setText(`Score: ${gameState.score}`); 
        if (gameState.score === 500) {
            droneGenLoop.delay = 700;
            gameState.speed += 50;
            gameState.bulletSpeed += 100;
        }
        if (gameState.score === 1000) {
            this.physics.pause();
            droneGenLoop.destroy();
            this.add.text(100, 275, 'You defended the earth', {
                fill: '#00FF00',
                fontSize: 26
            });
            this.add.text(300, 300, 'Press to Play Again', {
                fill: '#00FF00',
                fontSize: 26
            });
            this.input.on('pointerup', () => {
                gameState.score = 0;
                gameState.count = 0;
                gameState.speed = 200;
                gameState.bulletSpeed = 400;
                droneGenLoop.delay = 1000;
                gameState.hp = 0;
                gameState.hpText.setText(`HP:${gameState.hp}`);
                this.scene.restart();
            })
        }
    });
    this.physics.add.collider(gameState.drones, platforms, (drone) => {
        drone.destroy();
        gameState.count += 1;
        gameState.countText.setText(`Invaders: ${gameState.count}`);
        if (gameState.count === 10) {
            this.physics.pause();
            droneGenLoop.destroy();
            this.add.text(400, 275, 'Game Over');
            this.add.text(400, 300, 'Click to Restart');
            this.input.on('pointerup', () => {
                this.scene.restart();
            })
        }
    });
    this.physics.add.collider(gameState.player, gameState.drones, (player, drone) => {
        drone.destroy();
        gameState.hp -= 1;
        gameState.hpText.setText(`HP:${gameState.hp}`);
        if (gameState.hp == 0) {
            this.physics.pause();
            droneGenLoop.destroy();
            this.add.text(400, 275, 'Game Over');
            this.add.text(400, 300, 'Click to Restart');
            this.input.on('pointerup', () => {
                this.scene.restart();
            })
        }
    });
}

function update() {
    gameState.hpText.x = gameState.player.body.position.x+30;
    gameState.hpText.y = gameState.player.body.position.y-20;
    if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(gameState.speed);
    } else if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(gameState.speed * -1);
    } else if (gameState.cursors.up.isDown) {
        gameState.player.setVelocityY(gameState.speed * -1);
    } else if (gameState.cursors.down.isDown) {
        gameState.player.setVelocityY(gameState.speed);
    }
    else {
        gameState.player.setVelocity(0);
    }

    if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
        gameState.bullet.create(gameState.player.x+50, gameState.player.y, 'bullet').setGravityX(gameState.bulletSpeed).setScale(0.3);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 550,
    backgroundColor: "ADD8E6",
    physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          enableBody: true,
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);