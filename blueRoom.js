import Player from './player.js';

export default class BlueRoom extends Phaser.Scene {
    constructor() {
      super('BlueRoom');
    }
  
    preload() {

    }
  
    create() {
        // camera
        //this.cameras.main.setBounds(0, -gameHeight, gameWidth * 2, gameHeight*1.6);
        this.physics.world.setBounds(0, -gameHeight, gameWidth, gameHeight*2);

        // create world
        this.platforms = this.physics.add.staticGroup();
        let floor = this.add.rectangle(50,500,1600,100, 0xffffff).setOrigin(0,0);
        this.platforms.add(floor);
        this.platforms.add(this.add.rectangle(0,-800,200,1600, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(1200,-800,100,1600, 0xffffff).setOrigin(0,0));
        

        // create player
        this.player = new Player(this, 500, 300, 'dude');
        

        // add physics
        this.physics.add.collider(this.player, this.platforms);

        // add camera
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 50);
        this.cameras.main.setZoom(0.9);
    }
  
    update() {
        this.player.update();
    }
  }

let gameWidth = 1600;
let gameHeight = 1000;