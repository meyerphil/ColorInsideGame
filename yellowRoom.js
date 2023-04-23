import Player from './player.js';

export default class YellowRoom extends Phaser.Scene {
    constructor() {
      super('YellowRoom');
    }
  
    preload() {
      this.load.image('block', 'assets/block.png');
    }
  
    create() {
        // camera
        //this.cameras.main.setBounds(0, -gameHeight, gameWidth * 2, gameHeight*1.6);
        this.physics.world.setBounds(0, -gameHeight, gameWidth, gameHeight*2);

        // create world
        this.platforms = this.physics.add.staticGroup();
        let floor = this.add.rectangle(50,500,1600,100, 0xffffff).setOrigin(0,0);
        this.platforms.add(floor);
        this.platforms.add(this.add.rectangle(0,0,100,500, 0xffffff).setOrigin(0,0));
        
        // dropping blocks
        this.blocks = this.physics.add.group();
        this.heightDrop = -400;
        this.blockLevel = 0;

        this.lastBlock = null;

        this.dropBlocks = function (blocksGroup){
          let randomNumber = Phaser.Math.Between(0, 4);
          for (let i = 0; i <= 4; i++){
            if(i != randomNumber){
              //blocksGroup.create(200 + i * 150,-800, 'block').setOrigin(0,0).setScale(0.75);
              let block = blocksGroup.create(200 + i * 150, this.heightDrop, 'block').setOrigin(0,0).setScale(0.75);
              block.body.gravity.y = 0.1;
              this.lastBlock = block;
            }
          }
        }

        this.dropBlocks(this.blocks);

        this.myInterval = setInterval(() => {
          this.dropBlocks(this.blocks);
          this.heightDrop -= 150;
          this.blockLevel++;
          this.platforms.add(this.add.rectangle(50,500 - this.blockLevel * 150,1600,150, 0xffffff).setOrigin(0,0));
        }, 3000);


        // create player
        this.player = new Player(this, 500, 300, 'dude');
        

        // add physics
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.blocks, this.platforms);
        this.physics.add.collider(this.blocks, this.player);
        this.physics.add.collider(this.blocks);

        // player can collide with blocks,
        // player will die if vertical velocity of blocks is > 0
        // yVel == 0, then won't die and can use it to jump higher

        // basically can be a for loop that generates a row of blocks,
        // ommits one block by RNG, can't be same as previous position(var check)

        // add camera
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 200);
        this.cameras.main.setZoom(0.5);
    }
  
    update() {
        this.player.update();
    }
  }

let gameWidth = 1600;
let gameHeight = 1000;