const gameState = {}

function preload() {
    this.load.image('bg', 'assets/background_one.png');
}

function create() {
    gameState.bg = this.add.image(400, 275, 'bg');
}

function update() {

}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 550,
    backgroundColor: "ADD8E6",
    physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
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