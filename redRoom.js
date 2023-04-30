import Player from './player.js';

export default class RedRoom extends Phaser.Scene {
    constructor() {
      super('RedRoom');
    }
  
    preload() {
      this.load.image('red', 'assets/red.png');
      this.load.image('blockRed', 'assets/redBlock.png');
      this.load.image('word', 'assets/word.png');
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

        // add falling platforms
        this.blocks = this.physics.add.group();
        this.blockGroup = [];
        this.blockGroup.push({"block" : this.blocks.create(200, 300 + shiftDown, 'blockRed').setOrigin(0,0).setScale(0.4),
                              "collide" : true});
        this.blockGroup.push({"block" : this.blocks.create(1280, 300 + shiftDown, 'blockRed').setOrigin(0,0).setScale(0.45),
                              "collide" : true});
        this.blockGroup.push({"block" : this.blocks.create(700, 100 + shiftDown, 'blockRed').setOrigin(0,0).setScale(0.35),
                              "collide" : true});
        this.blockGroup.push({"block" : this.blocks.create(1050, -50 + shiftDown, 'blockRed').setOrigin(0,0).setScale(0.4),
                              "collide" : true});
        this.blockGroup.push({"block" : this.blocks.create(1280, -250 + shiftDown, 'blockRed').setOrigin(0,0).setScale(0.45),
                              "collide" : true});
        this.blockGroup.push({"block" : this.blocks.create(200, -105 + shiftDown, 'blockRed').setOrigin(0,0).setScale(0.45),
                              "collide" : true});
        this.blockGroup.push({"block" : this.blocks.create(600, -300 + shiftDown, 'blockRed').setOrigin(0,0).setScale(0.35),
                              "collide" : true});

        
        for(let i = 0; i < this.blockGroup.length; i++){
          this.blockGroup[i].block.body.gravity.y = 0.1;
          this.blockGroup[i].block.body.allowGravity = false;
          this.blockGroup[i].block.setImmovable(true);
        }


        // create player
        this.player = new Player(this, 500, 300, 'dude');
        
        // create red
        let currentBlock = Phaser.Utils.Array.GetRandom(this.blockGroup);
        let currentPos = {x: currentBlock.block.x + (currentBlock.block.width * 0.25), 
                          y: currentBlock.block.y - 90};

        
        this.red = this.physics.add.sprite(currentPos.x, currentPos.y, 'red').setScale(0.5).setOrigin(0.5,0.5);
        this.red.body.allowGravity = false;
        this.red.setImmovable(true);
        this.redBullets = [];
        this.redHealth = 100;

        // shooting
        let shootingTimer = this.time.addEvent({
          delay: 2000,
          loop: true,
          callback: function () {
              let bullet = this.physics.add.sprite(this.red.x, this.red.y, 'word').setScale(0.5);
              bullet.body.allowGravity = false;
              this.physics.moveToObject(bullet, this.player, 500);
              this.redBullets.push(bullet);
          },
          callbackScope: this
        });

        let movingTimer = this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: function () {
                currentBlock = Phaser.Utils.Array.GetRandom(this.blockGroup);
                currentPos = {x: currentBlock.block.x + (currentBlock.block.width * 0.25), 
                              y: currentBlock.block.y - 90};
                let fadeOutTween = this.tweens.add({
                  targets: this.red,
                  alpha: 0,
                  duration: 500,
                  onComplete: function () {
                      currentBlock.block.visible = true;
                      currentBlock.block.active = true;
                      currentBlock.block.collide = true;
                     
                      this.red.setPosition(currentPos.x, currentPos.y);
                      let fadeInTween = this.tweens.add({
                          targets: this.red,
                          alpha: 1,
                          duration: 500
                      });
                  },
                  callbackScope: this
              });
          },
          callbackScope: this
        });


        
        // add physics
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.blocks, this.platforms);
        this.physics.add.collider(this.player, this.blocks, null, (player, block) => {
          let index = this.blockGroup.findIndex(obj => obj.block == block);
          return this.blockGroup[index].collide;
      }, this);

        this.physics.add.collider(this.redBullets, this.platforms, function (bullet, platform) {
          bullet.destroy();
        });

        this.physics.add.collider(this.player, this.redBullets, function(player, bullet) {
          player.hit();
          bullet.destroy();
        });

        this.physics.add.overlap(this.redBullets, this.blocks, (bullet, block) => {
          let index = this.blockGroup.findIndex(obj => obj.block == block);
          if(this.blockGroup[index].block == currentBlock.block){
            return;
          }
          if(this.blockGroup[index].collide == true){
            bullet.destroy();
            this.blockHit(index);
          }
          
          
        });

        this.physics.add.overlap(this.player.bullets, this.blocks, (bullet, block) => {
          let index = this.blockGroup.findIndex(obj => obj.block == block);
          if(this.blockGroup[index].collide == true){
            bullet.destroy();
          }
        });

        this.physics.add.collider(this.player.bullets, this.red, (bullet, red) => {
          bullet.destroy();
          this.redHealth -= 10;
          console.log(this.redHealth);

          if(this.redHealth <= 0){
            this.redDefeat();
          } else {
            red.setTint(0x99ffff);
            this.time.addEvent({
              delay: 200,
              callback: function() {
                red.clearTint();
              },
              callbackScope: this
            });
          }
          
        });
        

        // add camera
        //this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 50);
        this.cameras.main.setZoom(0.9);

        
    }

    blockHit(index){
      this.blockGroup[index].collide = false;
      let block = this.blockGroup[index].block;
      block.visible = false;
      block.active = false;
      this.time.addEvent({
          delay: 5000,
          callback: function () {
            block.visible = true;
            block.active = true;
            this.blockGroup[index].collide = true;
          },
          callbackScope: this,
          loop: false
      });
    }

    redDefeat(){
      clearInterval(this.myInterval);
      this.time.removeAllEvents()
      this.red.setTint(0x99ffff);
      for(let i = 0; i < this.blockGroup.length; i++){
        this.blockGroup[i].block.visible = true;
        this.blockGroup[i].block.active = true;
        this.blockGroup[i].collide = true;
      }
      this.physics.add.collider(this.player, this.red, () => {
        this.game.gameOptions.RedWin = true;
        this.scene.stop();
        this.scene.start('ProtoGame');
      });
    }

  
    update() {
        this.player.update();
    }
  }

let gameWidth = 1600;
let gameHeight = 1000;
const shiftDown = 500;