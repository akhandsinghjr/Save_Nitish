// JavaScript (Phaser 3)

let score = 0;

class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {
    this.load.image('backgrounds', 'assets/background.webp');
  }

  create() {
    const background = this.add.image(0, 0, 'backgrounds').setOrigin(0, 0);
    background.displayWidth = this.sys.game.config.width;
    background.displayHeight = this.sys.game.config.height;
    this.add.text(400, 490, 'Press S to Start', { fontSize: '22px', fill: '#000000', fontWeight: 'bold' }).setOrigin(0.5);
    this.add.text(400, 520, 'Press I for Instructions', { fontSize: '20px', fill: '#000000', fontWeight: 'bold' }).setOrigin(0.5);

    this.input.keyboard.on('keydown-S', () => {
      this.scene.start('GameScene');
    });

    this.input.keyboard.on('keydown-I', () => {
      this.scene.start('InstructionScene');
    });
  }
}

function addTextWithBackground(scene, x, y, text, textStyle, backgroundColor) {
  // Create the text object
  const textObject = scene.add.text(x, y, text, textStyle).setOrigin(0.5);

  // Create the background rectangle
  const background = scene.add.rectangle(
    textObject.x,
    textObject.y,
    textObject.width + 10, // Add some padding
    textObject.height + 10, // Add some padding
    backgroundColor
  ).setOrigin(0.5);

  // Ensure the background is behind the text
  background.setDepth(textObject.depth - 1);

  return { textObject, background };
}



class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  preload() {
    this.load.image('pbackground', 'assets/background.jpg'); // Ensure the background image is loaded
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, 'pbackground');
    this.add.text(400, 200, 'Paused', { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 300, 'Press R to Restart', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 400, 'Press E to Exit', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

    this.input.keyboard.on('keydown-R', () => {
      score = 0; // Reset score
      this.scene.stop('PauseScene');
      this.scene.stop('GameScene');
      this.scene.stop('Level2Scene'); // Stop Level2Scene as well
      this.scene.start('StartScene');
    });

    this.input.keyboard.on('keydown-E', () => {
      this.scene.stop('PauseScene');
      this.scene.stop('GameScene');
      this.scene.stop('Level2Scene'); // Stop Level2Scene as well
      this.scene.start('StartScene');
    });

    this.input.keyboard.on('keydown-P', () => {
      if (this.scene.isPaused('GameScene')) {
        this.scene.resume('GameScene');
      } else if (this.scene.isPaused('Level2Scene')) {
        this.scene.resume('Level2Scene');
      }
      this.scene.stop('PauseScene');
    });
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }
  preload() {
    this.load.image('gobg', 'assets/gameover.webp');
  }

  create() {
    const gobg = this.add.image(0, 0, 'gobg').setOrigin(0, 0);
    gobg.displayWidth = this.sys.game.config.width;
    gobg.displayHeight = this.sys.game.config.height;

    this.add.text(400, 450, 'Press R to Restart', { fontSize: '32px', fill: '#000000' }).setOrigin(0.5);
    this.add.text(400, 500, 'Final Score: ' + score, { fontSize: '32px', fill: '#000000' }).setOrigin(0.5);

    this.input.keyboard.on('keydown-R', () => {
      score = 0; // Reset score
      this.scene.start('StartScene');
    });
  }
}

class InstructionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionScene' });
  }

  preload() {
    this.load.image('background', 'assets/background.jpg');
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, 'background');
    this.add.text(400, 200, 'Instructions', { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 300, 'Use arrow keys to move', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 350, 'Collect all objects to open the gate', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 400, 'Avoid the villains', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 450, 'Press Space to shoot', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 500, 'Press B to go back', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

    this.input.keyboard.on('keydown-B', () => {
      this.scene.start('StartScene');
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('background', 'assets/background.jpg');
    this.load.image('player', 'assets/player.png');
    this.load.image('object', 'assets/object.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('villain', 'assets/villain.png');
    this.load.image('projectile', 'assets/chap.png');
    this.load.image('gate', 'assets/gate.png'); // Load the gate image
  }

  create() {
    // Add background tile
    this.add.tileSprite(400, 300, 800, 600, 'background');




    //add score

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
    // Add player sprite
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(32 / player.width, 32 / player.height); // Scale the player to 16x16

    //pause 
    this.input.keyboard.on('keydown-P', () => {
      this.scene.pause();
      this.scene.launch('PauseScene');
    });

    // Add objects to collect
    objects = this.physics.add.group({
      key: 'object',
      repeat: 3,
      setXY: { x: 100, y: 100, stepX: 200 }
    });

    // Set random velocities for objects
    objects.children.iterate(function(object) {
      object.setCollideWorldBounds(true);
      object.setBounce(1);
      object.setScale(32 / object.width, 32 / object.height); // Scale the object to 32x32
      object.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    });

    // Add walls
    walls = this.physics.add.staticGroup();
    for (let y = 0; y < 600; y += 32) {
      if (y < 256 || y > 320) {
        let wall = walls.create(768, y, 'wall');
        wall.setScale(32 / wall.width, 32 / wall.height); // Scale the wall to 32x32
        wall.refreshBody(); // Refresh the body to apply the scale
      }
    }

    // Add gate (initially blocked)
    gate = this.physics.add.staticGroup();
    let gatePart1 = gate.create(768, 256, 'gate');
    gatePart1.setScale(32 / gatePart1.width, 32 / gatePart1.height); // Scale the gate part to 32x32
    gatePart1.refreshBody(); // Refresh the body to apply the scale
    let gatePart2 = gate.create(768, 288, 'gate');
    gatePart2.setScale(32 / gatePart2.width, 32 / gatePart2.height); // Scale the gate part to 32x32
    gatePart2.refreshBody(); // Refresh the body to apply the scale
    let gatePart3 = gate.create(768, 320, 'gate'); // Add the new gate part
    gatePart3.setScale(32 / gatePart3.width, 32 / gatePart3.height); // Scale the gate part to 32x32
    gatePart3.refreshBody(); // Refresh the body to apply the scale

    // Add villains
    villains = this.physics.add.group({
      key: 'villain',
      repeat: 2,
      setXY: { x: 700, y: 100, stepY: 200 }
    });

    villains.children.iterate(function(villain) {
      villain.setCollideWorldBounds(true);
      villain.setBounce(1);
      villain.setScale(32 / villain.width, 32 / villain.height); // Scale the villain to 16x16
      villain.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    });

    // Add projectiles group
    projectiles = this.physics.add.group();

    // Enable cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Add collision detection between player and objects
    this.physics.add.overlap(player, objects, collectObject, null, this);

    // Add collision detection between player and walls
    this.physics.add.collider(player, walls);

    // Add collision detection between objects and walls
    this.physics.add.collider(objects, walls);

    // Add collision detection between objects
    this.physics.add.collider(objects, objects);

    // Add collision detection between player and gate
    this.physics.add.collider(player, gate);

    // Add collision detection between player and villains
    this.physics.add.collider(player, villains, hitVillain, null, this);

    // Add collision detection between projectiles and villains
    this.physics.add.collider(projectiles, villains, hitVillainWithProjectile, null, this);

    this.physics.add.collider(player, gate, passGate, null, this);

    // Add game over text (initially hidden)
    gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#ff0000' });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    // Add shooting functionality
    this.input.keyboard.on('keydown-SPACE', shootProjectile, this);
  }

  update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
      player.setVelocityY(160);
    } else {
      player.setVelocityY(0);
    }

    // Make villains move towards the player
    villains.children.iterate(function(villain) {
      this.physics.moveToObject(villain, player, 100);
    }, this);

    // Check if player has reached the right edge of the screen
    if (player.x >= 768 && collectedObjects >= 4) { // Adjust the condition to check for the right edge
      this.scene.start('Level2Scene'); // Switch to Level2Scene
    }
  }
}

class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });
    this.fastVillains = null; // Define fastVillains as a class property
  }

  preload() {
    this.load.image('background', 'assets/background.jpg');
    this.load.image('player', 'assets/player.png');
    this.load.image('object', 'assets/object.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('villain', 'assets/villain.png');
    this.load.image('fastVillain', 'assets/fastVillain.png'); // Load the fast villain image
    this.load.image('projectile', 'assets/chap.png');
    this.load.image('gate', 'assets/gate.png');
  }

  create() {
    // Add background tile
    this.add.tileSprite(400, 300, 800, 600, 'background');

    // Add player sprite
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(32 / player.width, 32 / player.height);

    // Add objects to collect
    objects = this.physics.add.group({
      key: 'object',
      repeat: 3,
      setXY: { x: 100, y: 100, stepX: 200 }
    });

    objects.children.iterate(function(object) {
      object.setCollideWorldBounds(true);
      object.setBounce(1);
      object.setScale(32 / object.width, 32 / object.height); // Scale the object to 32x32
      object.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    });

    // Add walls
    walls = this.physics.add.staticGroup();
    for (let y = 0; y < 600; y += 32) {
      if (y < 256 || y > 320) {
        let wall = walls.create(768, y, 'wall');
        wall.setScale(32 / wall.width, 32 / wall.height);
        wall.refreshBody();
      }
    }

    // Add gate (initially blocked)
    gate = this.physics.add.staticGroup();
    let gatePart1 = gate.create(768, 256, 'gate');
    gatePart1.setScale(32 / gatePart1.width, 32 / gatePart1.height);
    gatePart1.refreshBody();
    let gatePart2 = gate.create(768, 288, 'gate');
    gatePart2.setScale(32 / gatePart2.width, 32 / gatePart2.height);
    gatePart2.refreshBody();
    let gatePart3 = gate.create(768, 320, 'gate'); // Add the new gate part
    gatePart3.setScale(32 / gatePart3.width, 32 / gatePart3.height); // Scale the gate part to 32x32
    gatePart3.refreshBody(); // Refresh the body to apply the scale

    // Add villains
    villains = this.physics.add.group({
      key: 'villain',
      repeat: 2,
      setXY: { x: 700, y: 100, stepY: 200 }
    });

    villains.children.iterate(function(villain) {
      villain.setCollideWorldBounds(true);
      villain.setBounce(1);
      villain.setScale(32 / villain.width, 32 / villain.height);
      villain.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    });

    // Add fast villains
    this.fastVillains = this.physics.add.group({
      key: 'fastVillain',
      repeat: 1,
      setXY: { x: 100, y: 500, stepX: 200 }
    });

    this.fastVillains.children.iterate(function(fastVillain) {
      fastVillain.setCollideWorldBounds(true);
      fastVillain.setBounce(1);
      fastVillain.setScale(32 / fastVillain.width, 32 / fastVillain.height);
      fastVillain.setVelocity(Phaser.Math.Between(-112.5, 112.5), Phaser.Math.Between(-111.5, 111.5));// Faster speed
    });

    // Add projectiles group
    projectiles = this.physics.add.group();

    // Enable cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Add collision detection between player and objects
    this.physics.add.overlap(player, objects, collectObject, null, this);

    // Add collision detection between player and walls
    this.physics.add.collider(player, walls);

    // Add collision detection between objects and walls
    this.physics.add.collider(objects, walls);

    // Add collision detection between objects
    this.physics.add.collider(objects, objects);

    // Add collision detection between player and gate
    this.physics.add.collider(player, gate, passGate, null, this);

    // Add collision detection between player and villains
    this.physics.add.collider(player, villains, hitVillain, null, this);

    // Add collision detection between player and fast villains
    this.physics.add.collider(player, this.fastVillains, hitVillain, null, this);

    // Add collision detection between projectiles and villains
    this.physics.add.collider(projectiles, villains, hitVillainWithProjectile, null, this);

    // Add collision detection between projectiles and fast villains
    this.physics.add.collider(projectiles, this.fastVillains, hitVillainWithProjectile, null, this);

    // Add game over text (initially hidden)
    gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#ff0000' });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    // Add shooting functionality
    this.input.keyboard.on('keydown-SPACE', shootProjectile, this);

    // Add pause functionality
    this.input.keyboard.on('keydown-P', () => {
      this.scene.pause();
      this.scene.launch('PauseScene');
    });

    // Display score
    this.scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ffffff' });

    // Reset collected objects count
    collectedObjects = 0;
  }

  update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
      player.setVelocityY(160);
    } else {
      player.setVelocityY(0);
    }

    // Make villains move towards the player
    villains.children.iterate(function(villain) {
      this.physics.moveToObject(villain, player, 100);
    }, this);

    // Make fast villains move towards the player
    this.fastVillains.children.iterate(function(fastVillain) {
      this.physics.moveToObject(fastVillain, player, 200); // Faster speed
    }, this);

    // Check if player has reached the right edge of the screen
    if (player.x >= 768 && collectedObjects >= 4) { // Adjust the condition to check for the right edge
      this.scene.start('EndingScene'); // Switch to EndingScene
    }
  }
}



class EndingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndingScene' });
  }
  preload() {
    this.load.image('win', 'assets/winning.webp');
  }

  create() {
    // Display the ending message
    const winn = this.add.image(0, 0, 'win').setOrigin(0, 0);
    winn.displayWidth = this.sys.game.config.width;
    winn.displayHeight = this.sys.game.config.height;


    // Display the final score
    this.add.text(405, 530, score, { fontSize: '38px', fill: '#000000' }).setOrigin(0.5);

    // Add a restart button
    const restartButton = this.add.text(410, 570, 'Restart', { fontSize: '25px', fill: '#ff0000' }).setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene'); // Restart the game
    });
  }
}


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [StartScene, InstructionScene, GameScene, GameOverScene, PauseScene, Level2Scene, EndingScene] // Add EndingScene here
};

const game = new Phaser.Game(config);

let player;
let cursors;
let objects;
let walls;
let gate;
let villains;
let projectiles;
let collectedObjects = 0;
let gameOverText;

function collectObject(player, object) {
  object.disableBody(true, true);
  collectedObjects += 1;
  score += 10; // Increase score by 10
  this.scoreText.setText('Score: ' + score); // Update score text
  checkGate();
}

function checkGate() {
  if (collectedObjects >= 4) {
    gate.clear(true, true); // Remove all gate parts
  }
}

// function hitVillain(player, villain) {
//   // gameOverText.setVisible(true);
//   // this.physics.pause();
//   // player.setTint(0xff0000);

// }

function hitVillain(player, villain) {
  this.scene.start('GameOverScene'); // Switch to GameOverScene
}

function shootProjectile() {
  const projectile = projectiles.create(player.x, player.y, 'projectile');
  projectile.setScale(32 / projectile.width, 32 / projectile.height); // Scale the projectile to 32x32
  projectile.setVelocityY(-300);
  projectile.setCollideWorldBounds(true);
  projectile.setBounce(1);
}

function hitVillainWithProjectile(projectile, villain) {
  projectile.destroy();
  villain.destroy();
  score += 20; // Increase score by 20
  this.scoreText.setText('Score: ' + score); // Update score text
}

function passGate(player, gate) {
  if (collectedObjects >= 4) {
    this.scene.start('Level2Scene'); // Switch to Level2Scene
  }
}