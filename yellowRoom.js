import Player from './player.js';

export default class YellowRoom extends Phaser.Scene {
    constructor() {
      super('YellowRoom');
    }
  
    preload() {
      this.load.image('block', 'assets/block.png');
      this.load.image('light', 'assets/light.png');
    }
  
    create() {
        console.log(this.game.gameOptions);

        // camera
        //this.cameras.main.setBounds(0, -gameHeight, gameWidth * 2, gameHeight*1.6);
        this.physics.world.setBounds(0, -100, gameWidth, gameHeight*2);

        // create world
        this.platforms = this.physics.add.staticGroup();
        let floor = this.add.rectangle(50,500+shiftDown,1600,100, 0xffffff).setOrigin(0,0);
        this.platforms.add(this.add.rectangle(0,-300,1600,100, 0xffffff).setOrigin(0,0));
        this.platforms.add(floor);
        this.platforms.add(this.add.rectangle(0,-800+shiftDown,200,1600, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(1550,-800+shiftDown,100,1600, 0xffffff).setOrigin(0,0));
        
        // dropping blocks
        this.blocks = this.physics.add.group();
        this.heightDrop = 0;
        this.blockLevel = 0;

        this.topBlock = [ [],
                          [],
                          [],
                          [],
                          [],
                          [],
                          [],
                          [],
                          []
        ];

        this.dropBlocks = function (blocksGroup){
          //console.log(this.topBlock);
          let randomNumber = Phaser.Math.Between(0, 8);
          let randomNumber2 = Phaser.Math.Between(0, 8);
          let randomNumber3 = Phaser.Math.Between(0, 8);

          for (let i = 0; i <= 8; i++){
            if(i == randomNumber || i == randomNumber2 || i == randomNumber3){


              if(this.topBlock[i].length < 6){
                let block = blocksGroup.create(200 + i * 150, this.heightDrop, 'block').setOrigin(0,0).setScale(0.75);
                block.body.gravity.y = 0.1;
                block.body.allowGravity = false;
                block.setImmovable(true);
                //block.body.onOverlap = true;
                this.topBlock[i].push(block);
                block.alpha = 0;

                this.tweens.add({
                    targets: block,
                    alpha: 1,
                    duration: 1000, 
                    ease: 'Linear' 
                });
                setTimeout(() => {
                  if(block.active){
                      block.setImmovable(false);
                      block.body.allowGravity = true;
                  }
                }, 1000);
              }

            }
          }
        }

        this.dropBlocks(this.blocks);

        this.myInterval = setInterval(() => {
          this.dropBlocks(this.blocks);
          //this.heightDrop -= 150;
          this.blockLevel++;
          //this.platforms.add(this.add.rectangle(50,500 - this.blockLevel * 150,1600,150, 0xffffff).setOrigin(0,0));
        }, 3000);


        // create player
        this.player = new Player(this, 500, 300, 'dude');
        //this.player.body.onOverlap = true;
        
        // add light
        this.light = this.physics.add.staticImage(800, -100, 'light').setScale(1);

        this.physics.add.collider(this.player, this.light, () => {
          clearInterval(this.myInterval);
          this.time.removeAllEvents()
          this.game.gameOptions.YellowWin = true;
          this.scene.stop();
          this.scene.start('ProtoGame');
        });

        // add physics
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.blocks, this.platforms);
        this.physics.add.collider(this.player, this.blocks, function(player, fallingObject) {
          //console.log("player y " + player.y + " block y " + fallingObject.y);
          if (fallingObject.y + 150 < player.y) {
            player.hit();
          }
        });
        this.physics.add.collider(this.blocks, this.blocks, function(obj1, obj2) {
          // stop the movement of both objects
          obj1.body.stop();
          obj2.body.stop();
          obj1.setImmovable(true);
          obj2.setImmovable(true);
          obj1.body.allowGravity = false;
          obj2.body.allowGravity = false;
          //console.log("collide");
      });
      

      this.physics.add.collider(this.blocks, this.player.bullets, (obj1, obj2) => {
        this.blocks.getChildren().forEach((gameObject) => {
          if (!gameObject.body.touching.down) {
            gameObject.setImmovable(false);
            gameObject.body.allowGravity = true;
          }
        });
        
        
        let index = -1;
        for( let i = 0; i < this.topBlock.length; i++){
          index = this.topBlock[i].indexOf(obj2);
          if(index != -1){
            this.topBlock[i].splice(index, 1);
            break;
          }
          
        }
        obj1.destroy();
        obj2.destroy();
      });

        // player can collide with blocks,
        // player will die if vertical velocity of blocks is > 0
        // yVel == 0, then won't die and can use it to jump higher

        // basically can be a for loop that generates a row of blocks,
        // ommits one block by RNG, can't be same as previous position(var check)

        // add camera
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 200);
        this.cameras.main.setZoom(0.7);
    }
  
    update() {
        this.player.update();

        
    }
  }

let gameWidth = 1600;
let gameHeight = 1000;
const shiftDown = 500;