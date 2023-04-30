import Player from './player.js';
import YellowRoom from './yellowRoom.js';
import BlueRoom from './blueRoom.js';
import RedRoom from './redRoom.js';

class ProtoGame extends Phaser.Scene {
    ground;

    constructor() {
        super('ProtoGame');
    }
    preload(){
        this.load.image('monkey', 'assets/sectionimage.png');
        this.load.image('box', 'assets/colorBox.png');
        this.load.image('dude', 'assets/stick.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('door', 'assets/door.png');
    }
    create(){
        console.log(this.game.gameOptions);
        
        // scenes
        if (!this.scene.get('YellowRoom')) {
            this.scene.add('YellowRoom', YellowRoom);
        }
        if (!this.scene.get('BlueRoom')) {
        this.scene.add('BlueRoom', BlueRoom);
        }
        if (!this.scene.get('RedRoom')) {
            this.scene.add('RedRoom', RedRoom);
        }
        //this.scene.start('BlueRoom');

        // b&w filter
        let bw = true;
        
        
        const grayscalePipeline = this.renderer.pipelines.add('Gray', new GrayScalePipeline(this.game));
        
        // camera demo https://labs.phaser.io/edit.html?src=src/camera/follow%20user%20controlled%20sprite.js
        this.cameras.main.setBounds(0, 0, gameWidth * 2, gameHeight*2);
        this.physics.world.setBounds(0, 0, gameWidth*2, gameHeight*2);

        // physics demo https://labs.phaser.io/edit.html?src=src/physics/arcade/basic%20platform.js

        // create world
        this.platforms = this.physics.add.staticGroup();
        let floor = this.add.rectangle(50,500+shiftDown,1600,100, 0xffffff).setOrigin(0,0);
        this.platforms.add(this.add.rectangle(0,0,1600,100, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(0,-800+shiftDown,200,1600, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(1600,-800+shiftDown,100,1600, 0xffffff).setOrigin(0,0));
        
        this.platforms.add(floor);
        this.platforms.add(this.add.rectangle(200,300+shiftDown,100,50, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(700,300+shiftDown,200,50, 0xffffff).setOrigin(0,0));
        this.platforms.add(this.add.rectangle(100,100+shiftDown,20,20, 0xffffff).setOrigin(0,0));
        
        let b = this.add.image(100,250+shiftDown, 'box').setOrigin(0,0).setScale(0.4);
        this.platforms.add(b);

        this.doorY = this.physics.add.staticImage(1400,440+shiftDown, 'door').setScale(0.5);
        this.doorB = this.physics.add.staticImage(870,230+shiftDown, 'door').setScale(0.5);
        this.doorR = this.physics.add.staticImage(250,195+shiftDown, 'door').setScale(0.5);


        // create player
        this.player = new Player(this, 500, 300+shiftDown, 'dude');
        //this.add.existing(this.player);
        
        // apply filter
        if (bw == true){
            b.setPipeline(grayscalePipeline);
            this.player.setPipeline(grayscalePipeline);
        }  else {
            b.resetPipeline();
        }
        // add physics
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.doorY, () => {
            // Transition to the next level
            this.scene.stop();
            this.scene.start('YellowRoom');
        });
        this.physics.add.collider(this.player, this.doorB, () => {
            // Transition to the next level
            this.scene.stop();
            this.scene.start('BlueRoom');
        });
        this.physics.add.collider(this.player, this.doorR, () => {
            // Transition to the next level
            this.scene.stop();
            this.scene.start('RedRoom');
        });


        

        // add camera
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        
    }
    update(){
        this.player.update();
    }
}




let gameWidth = 1600;
let gameHeight = 900;
const shiftDown = 500;

let config = {
    type: Phaser.WEBGL,
    width: 1600,
    height: 1000,
    backgroundColor: 0x000000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }
        }
    },
    scene: [ProtoGame],
}

let game = new Phaser.Game(config);

game.gameOptions = {
    YellowWin: false,
    BlueWin: false,
    RedWin: false,
}

// playtest two rooms
// complete 3 colors to unlock final room
// take mechanics from previous rooms to beat boss
// all mini bosses, with own gimmick

// powerups
// anger is a short powerup, increase damage
//     10 seconds duration, 20 sec cooldown

// sadness is a shield
//  one hit negate. 2 charges, 10 sec per charge use
//      40 second cooldown for complete depletion

// happiness is double jump
//    directional double jump

// boss
// red mode(shoot a bunch)
// blue mode(recover mode,
// break shield to prevent healing, 50 damage)
// yellow mode(falling blocks, 
// use platform as a shield, they crumble from blocks)
// the order of attacks is random
//  60% chance of red, 40% chance of yellow
//  40% health, then it goes into recovery mode



// yellow
// falling blocks land, must stand in safe spot
// avoid blocks, then use blocks as stepping up
// reaching yellow dude at ceiling.
// Looking pass emotion
// like inverse tetris.

// blue
// opening up(breaking down wall) to conquer sadness
// shoot it down
// strategic in where to shoot,
// can't be repetitive.
// hexagon shield in center of room.

// red
// red dude destroys platform across,
// platforms rebuild after 5 secs.
// red guy is shooting bad words


// can choose any emotion in any order

// health
// base 3
// each room +1
// final room 6 total hearts

// damage
// base 2
// each room +1
// final room is 5
// empowered attack double damages