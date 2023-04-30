export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        // Add the player sprite to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set player properties
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.setDepth(1);
        this.keyboard = scene.input.keyboard;
        this.pointer = scene.input.activePointer;
        this.bullets = [];
        this.lastFiredTime = 0;
        this.setScale(0.5);

        // create health
        this.health = [];
        this.maxHealth = 3;
        if(this.scene.scene.key == "YellowRoom"){
            for (let i = 0; i < this.maxHealth; i++) {
                const heartSprite = scene.add.sprite(-250 + (i * 120), 0, 'dude').setScale(0.5).setScrollFactor(0);
                
                this.health.push(heartSprite);
            }
        }
        if(this.scene.scene.key == "RedRoom"){
            for (let i = 0; i < this.maxHealth; i++) {
                const heartSprite = scene.add.sprite((i * 120), 0, 'dude').setScale(0.5).setScrollFactor(0);
                
                this.health.push(heartSprite);
            }
        }
        this.canGetHurt = true;

        //powers
        this.jumps = 0;
        this.canJump = false;
        this.maxJumps = 1;
        if(this.scene.game.gameOptions.YellowWin){
            this.maxJumps = 2;
        }
        //console.log(this.maxJumps);
      
    }
  
    update() {

        if (this.body.touching.down) {
            this.jumps = 0; // reset jumps
            this.canJump = true;
        }

        if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown)
        {
            this.setVelocityX(-300);
        }
        else if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown)
        {
            this.setVelocityX(300);
        }
        else
        {
            this.setVelocityX(0);
        }

        if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown && this.jumps < this.maxJumps && this.canJump)
        {   
            if(!(this.body.touching.down)){
                if(this.maxJumps > 1){
                    this.setVelocityY(-500);
                    this.jumps++;
                    this.jumps++;
                    //console.log(this.jumps);
                    this.canJump = false;
                
    
                    setTimeout(() => {
                        this.canJump = true;
                    }, 500);
                }
            } else {
                this.setVelocityY(-500);
                this.jumps++;
                //console.log(this.jumps);
                this.canJump = false;
            

                setTimeout(() => {
                    this.canJump = true;
                }, 500);
            }
        }

        if (this.pointer.isDown) {
            this.shoot();
        }

        this.bullets.forEach((bullet, index) => {
            if (bullet.y < 0 || bullet.y > this.scene.sys.game.config.height) {
              bullet.destroy();
              this.bullets.splice(index, 1);
            }
        });

    }

    hit(){
        this.setAlpha(0.2);

        if(this.health.length > 0 && this.canGetHurt){
            this.canGetHurt = false;
            this.health[this.health.length - 1].destroy();
            this.health.splice(this.health.length - 1, 1);
        }

        if (this.health.length == 0){
            this.respawn();
            return;
        }

        setTimeout(() => {
            this.canGetHurt = true;
            this.setAlpha(1);
        }, 1000);
    }

    respawn(){
        clearInterval(this.scene.myInterval);
        this.scene.time.removeAllEvents()
        this.scene.scene.stop();
        this.scene.scene.start('ProtoGame');
    }

    shoot() {
        //console.log(this.bullets);

        let elapsedTime = this.scene.time.now - this.lastFiredTime;
        if (elapsedTime < 500) {
        return;
        }
        
        if (this.bullets.length >= 2) {
            return;
        }

        let bullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet');
        this.bullets.push(bullet);
        //console.log(this.x + "," + this.y);

        let pointerWorld = this.scene.cameras.main.getWorldPoint(this.pointer.x, this.pointer.y);

        let velocityX = pointerWorld.x - this.x;
        let velocityY = pointerWorld.y - this.y;
        let magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        velocityX /= magnitude;
        velocityY /= magnitude;
        velocityX *= 400;
        velocityY *= 400;
        bullet.setVelocity(velocityX, velocityY);
        bullet.setCollideWorldBounds(true);
        bullet.body.allowGravity = false;
        //console.log({velocityX});


    
        this.scene.physics.add.collider(bullet, this.scene.platforms, function(bullet, platform) {
            // Handle the collision between the bullet and a platform
            bullet.destroy();
        });

        setTimeout(() => {
            bullet.destroy();
          }, 3000);

        bullet.on('destroy', function() {
            // Remove the bullet from the bullets array
            let index = this.bullets.indexOf(bullet);
            if (index > -1) {
              this.bullets.splice(index, 1);
            }
        }, this);

        this.lastFiredTime = this.scene.time.now;
      }

  }