import Player from './player.js';

export default class BossRoom extends Phaser.Scene {
    constructor() {
      super('BossRoom');
    }
  
    preload() {
      //this.load.image('red', 'assets/red.png');
    }
  
    create() {
        // camera
        this.cameras.main.setBounds(-50, -200, gameWidth * 2, gameHeight*1.6);
        this.physics.world.setBounds(0, -100, gameWidth*2, gameHeight*2);

        // create world
        this.platforms = this.physics.add.staticGroup();
        let floor = this.add.rectangle(50,500+shiftDown,1600,100, 0xffffff).setOrigin(0,0);
        let ceiling = this.add.rectangle(50,-100,1600,100, 0xffffff).setOrigin(0,0);
        this.platforms.add(floor);
        this.platforms.add(ceiling);
        this.platforms.add(this.add.rectangle(0,-800+shiftDown,200,1600, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(1600,-800+shiftDown,100,1600, 0xffffff).setOrigin(0,0));

        // create player
        this.player = new Player(this, 500, 300, 'dude');

        // create boss
        this.boss = this.physics.add.sprite(900,850, 'dude').setScale(1.5).setOrigin(0.5,0.5);
        this.boss.body.allowGravity = false;
        this.boss.setImmovable(true);

        this.bossPhases = ['red','blue','yellow'];
        
        // add physics
        this.physics.add.collider(this.player, this.platforms);

        // add camera
        //this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 50);
        this.cameras.main.setZoom(0.9);

        
    }

  
    update() {
        this.player.update();
    }
  }

let gameWidth = 1600;
let gameHeight = 1000;
const shiftDown = 500;

// boss
// red mode(shoot a bunch)
// blue mode(recover mode,
// break shield to prevent healing, 50 damage)
// yellow mode(falling blocks, 
// use platform as a shield, they crumble from blocks)
// the order of attacks is random
//  60% chance of red, 40% chance of yellow
//  less than 40% health, then it goes into recovery mode
