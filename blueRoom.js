import Player from './player.js';

export default class BlueRoom extends Phaser.Scene {
    constructor() {
      super('BlueRoom');
    }
  
    preload() {
      this.load.image('blue', 'assets/blue.png');
    }
  
    create() {
        // camera
        //this.cameras.main.setBounds(0, -gameHeight, gameWidth * 2, gameHeight*1.6);
        this.physics.world.setBounds(0, -100, gameWidth, gameHeight*2);

        // create world
        this.platforms = this.physics.add.staticGroup();
        let floor = this.add.rectangle(50,500+shiftDown,1600,100, 0xffffff).setOrigin(0,0);
        let ceiling = this.add.rectangle(50,-100,1600,100, 0xffffff).setOrigin(0,0);
        this.platforms.add(floor);
        this.platforms.add(ceiling);
        this.platforms.add(this.add.rectangle(0,-800+shiftDown,200,1600, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(1600,-800+shiftDown,100,1600, 0xffffff).setOrigin(0,0));

        // blocks on left 
        this.platforms.add(this.add.rectangle(200, 100+shiftDown,100,25, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(500, 300+shiftDown,100,30, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(500, 0+shiftDown,100,50, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(300, -200+shiftDown,100,25, 0xffffff).setOrigin(0,0));

        // blocks on right
        this.platforms.add(this.add.rectangle(1300, 300+shiftDown,100,20, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(1200, 100+shiftDown,100,25, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(1400, -100+shiftDown,100,10, 0xffffff).setOrigin(0,0));

        // create player
        this.player = new Player(this, 500, 300, 'dude');

        // create blue
        this.blue = this.physics.add.staticImage(870, 470, 'blue').setScale(0.7);
        this.blue.body.setSize(100,100);
        this.blue.body.setOffset(100,100);

        this.physics.add.collider(this.player, this.blue, () => {
          //clearInterval(this.myInterval);
          //this.time.removeAllEvents()
          console.log("Blue Win")
          this.game.gameOptions.BLueWin = true;
          this.scene.stop();
          this.scene.start('ProtoGame');
        });

        // add physics
        this.physics.add.collider(this.player, this.platforms);

        // add hex

        this.hex = [];
        let hexX = 625;
        let hexY = 200;
        this.hex.push(this.add.rectangle(125 + hexX, 0 + hexY, 50, 325, 0x0000ff).setOrigin(0, 0).setAngle(30)); // top left
        this.hex.push(this.add.rectangle(-40 + hexX, 285 + hexY, 50, 325, 0x0000ff).setOrigin(0, 0).setAngle(-30)); // bottom left
        this.hex.push(this.add.rectangle(390 + hexX, 0 + hexY, 50, 266, 0x0000ff).setOrigin(1, 1).setAngle(-90)); // top
        this.hex.push(this.add.rectangle(350 + hexX, 25 + hexY, 50, 325, 0x0000ff).setOrigin(0, 0).setAngle(-30)); // top right
        this.hex.push(this.add.rectangle(510 + hexX, 260 + hexY, 50, 325, 0x0000ff).setOrigin(0, 0).setAngle(30)); // bottom right
        this.hex.push(this.add.rectangle(390 + hexX, 520 + hexY, 50, 266, 0x0000ff).setOrigin(1, 1).setAngle(-90)); // bottom
        
        // set shield health
        this.shMaxHel = 3;
        this.shHel = [];
        this.currentWave = this.shMaxHel;
        for(let i = 0; i < 6; i++){
          this.shHel[i] = this.shMaxHel;
        }
        console.log(this.shHel);

        // get random
        this.newChosen();

        // add hitboxes for hex
        this.hexTL = this.physics.add.staticGroup();
        for(let i = 1; i < 16; i++){
          this.hexTL.add(this.add.rectangle(-40 + hexX + i*10, 285 + hexY - i*18,  15, 15, 0xff0000).setOrigin(0, 0).setVisible(false));
        }
        this.hexBL = this.physics.add.staticGroup();
        for(let i = 1; i < 16; i++){
          this.hexBL.add(this.add.rectangle(-40 + hexX + i*10, 275 + hexY + i*18,  15, 15, 0xff0000).setOrigin(0, 0).setVisible(false));
        }

        this.hexT = this.physics.add.staticGroup();
        this.hexT.add(this.add.rectangle(130 + hexX, hexY,  250, 15, 0xff0000).setOrigin(0, 0).setVisible(false));
        
        this.hexBR = this.physics.add.staticGroup();
        for(let i = 1; i < 16; i++){
          this.hexBR.add(this.add.rectangle(380 + hexX + i*10, 565 + hexY - i*18,  15, 15, 0xff0000).setOrigin(0, 0).setVisible(false));
        }
        this.hexTR = this.physics.add.staticGroup();
        for(let i = 1; i < 16; i++){
          this.hexTR.add(this.add.rectangle(540 + hexX - i*10, 285 + hexY - i*18,  15, 15, 0xff0000).setOrigin(0, 0).setVisible(false));
        }

        this.hexB = this.physics.add.staticGroup();
        this.hexB.add(this.add.rectangle(130 + hexX, 555+ hexY,  250, 15, 0xff0000).setOrigin(0, 0).setVisible(false));

        // add physics
        this.collidersPH = [];
        this.collidersPH.push(this.physics.add.collider(this.player, this.hexTL));
        this.collidersPH.push(this.physics.add.collider(this.player, this.hexBL));
        this.collidersPH.push(this.physics.add.collider(this.player, this.hexT));
        this.collidersPH.push(this.physics.add.collider(this.player, this.hexTR));
        this.collidersPH.push(this.physics.add.collider(this.player, this.hexBR));
        this.collidersPH.push(this.physics.add.collider(this.player, this.hexB));

        this.physics.add.collider(this.player.bullets, this.hexTL, (bullet) => {
          console.log("TL hit");
          bullet.destroy();
          if(this.shHel[0] == this.currentWave && this.chosen == 0){
            this.shHel[0]--;
            this.hex[0].setAlpha(0.5);
            console.log(this.shHel);
            this.hex[0].setFillStyle(0x0000ff);

            if(this.shHel.indexOf(this.currentWave) == -1){
              this.shieldBroke();
            } else {
              this.newChosen();
            }

          }
        });
        this.physics.add.collider(this.player.bullets, this.hexBL, (bullet) => {
          console.log("BL hit");
          bullet.destroy();
          if(this.shHel[1] == this.currentWave && this.chosen == 1){
            this.shHel[1]--;
            this.hex[1].setAlpha(0.5);
            console.log(this.shHel);
            this.hex[1].setFillStyle(0x0000ff);
            
            if(this.shHel.indexOf(this.currentWave) == -1){
              this.shieldBroke();
            } else {
              this.newChosen();
            }
          }

        });
        this.physics.add.collider(this.player.bullets, this.hexT, (bullet) => {
          console.log("T hit");
          bullet.destroy();
          if(this.shHel[2] == this.currentWave && this.chosen == 2){
            this.shHel[2]--;
            this.hex[2].setAlpha(0.5);
            console.log(this.shHel);
            this.hex[2].setFillStyle(0x0000ff);
           
            if(this.shHel.indexOf(this.currentWave) == -1){
              this.shieldBroke();
            } else {
              this.newChosen();
            }
          }
        });
        this.physics.add.collider(this.player.bullets, this.hexTR, (bullet) => {
          console.log("TR hit");
          bullet.destroy();
          if(this.shHel[3] == this.currentWave && this.chosen == 3){
            this.shHel[3]--;
            this.hex[3].setAlpha(0.5);
            console.log(this.shHel);
            this.hex[3].setFillStyle(0x0000ff);
          
            if(this.shHel.indexOf(this.currentWave) == -1){
              this.shieldBroke();
            } else {
              this.newChosen();
            }
          }
        });
        this.physics.add.collider(this.player.bullets, this.hexBR, (bullet) => {
          console.log("BR hit");
          bullet.destroy();
          if(this.shHel[4] == this.currentWave && this.chosen == 4){
            this.shHel[4]--;
            this.hex[4].setAlpha(0.5);
            console.log(this.shHel);
            this.hex[4].setFillStyle(0x0000ff);
           
            if(this.shHel.indexOf(this.currentWave) == -1){
              this.shieldBroke();
            } else {
              this.newChosen();
            }
          }
        });
        this.physics.add.collider(this.player.bullets, this.hexB, (bullet) => {
          console.log("B hit");
          bullet.destroy();
          if(this.shHel[5] == this.currentWave && this.chosen == 5){
            this.shHel[5]--;
            this.hex[5].setAlpha(0.5);
            console.log(this.shHel);
            this.hex[5].setFillStyle(0x0000ff);
            
            if(this.shHel.indexOf(this.currentWave) == -1){
              this.shieldBroke();
            } else {
              this.newChosen();
            }
          }
        });

        // add camera
        //this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 50);
        this.cameras.main.setZoom(0.9);

        
    }

    newChosen(){
      let valid = [];

      for (var i = 0; i < 6; i++) {
        if (this.shHel[i] === this.currentWave) {
          valid.push(i);
        }
      }

      let randomIndex = valid[Phaser.Math.Between(0, valid.length - 1)];

      console.log(randomIndex);
      this.chosen = randomIndex;
      this.hex[this.chosen].setFillStyle(0x5500bb);
    }

    shieldBroke(){
      this.currentWave--;
      console.log(this.currentWave);
      for(let i = 0; i < 6; i++){
        this.hex[i].setAlpha(1);
      }

      if(this.currentWave == 0){
        for(let i = 0; i < 6; i++){
          this.hex[i].destroy();
        }
        for(let i = 0; i < 6; i++){
          this.collidersPH[i].destroy();
        }

      } else {
        this.newChosen();
      }
    }
  
    update() {
        this.player.update();
    }
  }

let gameWidth = 1600;
let gameHeight = 1000;
const shiftDown = 500;