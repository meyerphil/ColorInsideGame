import ProtoGame from './script.js';

export default class CutScene extends Phaser.Scene {
    constructor() {
      super('CutScene');
    }
  
    preload() {
      this.load.image('0', 'assets/face0.jpg');
      this.load.image('1', 'assets/face1.jpg');
      this.load.image('2', 'assets/face2.jpg');
      this.load.image('3', 'assets/face3.jpg');
      this.load.image('4', 'assets/face4.jpg');
    }
  
    create() {
        if (!this.scene.get('ProtoGame')) {
        this.scene.add('ProtoGame', ProtoGame);
        }
        // camera
        //this.cameras.main.setBounds(-50, -200, gameWidth * 2, gameHeight*1.6);
        this.faces = [];
        if(!this.game.gameOptions.Win){
            this.faces.push(this.add.image(800, 500, '4'));
            this.faces.push(this.add.image(800, 500, '3'));
            this.faces.push(this.add.image(800, 500, '2'));
            this.faces.push(this.add.image(800, 500, '1'));
            this.faces.push(this.add.image(800, 500, '0'));
        } else {
            this.faces.push(this.add.image(800, 500, '0'));
            this.faces.push(this.add.image(800, 500, '1'));
            this.faces.push(this.add.image(800, 500, '2'));
            this.faces.push(this.add.image(800, 500, '3'));
            this.faces.push(this.add.image(800, 500, '4'));
        }

        for(let i = 0; i < 5; i++){
            this.faces[i].displayWidth = 1600;
            this.faces[i].displayHeight = this.faces[i].height * (this.faces[i].displayWidth / this.faces[i].width);
        }

        this.fadeFace();
        

        this.cameras.main.setZoom(0.9);

        
    }

    fadeFace(){
        this.tweens.add({
            targets: this.faces[4],
            alpha:0,
            duration: 2000,
            ease: 'Linear',
            delay: 1000,
            onComplete: () => {
                this.tweens.add({
                    targets: this.faces[3],
                    alpha:0,
                    duration: 2000,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.faces[2],
                            alpha:0,
                            duration: 2000,
                            ease: 'Linear',
                            onComplete: () => {
                                this.tweens.add({
                                    targets: this.faces[1],
                                    alpha:0,
                                    duration: 2000,
                                    ease: 'Linear',
                                    onComplete: () => {
                                        // this.tweens.add({
                                        //     targets: faces[0],
                                        //     alpha:0,
                                        //     duration: 500,
                                        //     ease: 'Linear',
                                        //     onComplete: function() {
                                            
                                        //     }
                                        // });
                                        if(!this.game.gameOptions.Win){
                                            this.time.removeAllEvents()
                                            this.scene.stop();
                                            this.scene.start('ProtoGame');
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    


  
    update() {

    }
  }

let gameWidth = 1600;
let gameHeight = 1000;