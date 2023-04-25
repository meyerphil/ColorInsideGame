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
    }
  
    update() {

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

        if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown && this.body.touching.down)
        {
            this.setVelocityY(-500);
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

    shoot() {
        console.log(this.bullets);

        let elapsedTime = this.scene.time.now - this.lastFiredTime;
        if (elapsedTime < 500) {
        return;
        }
        
        if (this.bullets.length >= 3) {
            return;
        }

        let bullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet');
        this.bullets.push(bullet);

        let pointerWorldX = this.scene.cameras.main.getWorldPoint(this.pointer.x, this.pointer.y).x;
        let pointerWorldY = this.scene.cameras.main.getWorldPoint(this.pointer.x, this.pointer.y).y;

        let velocityX = pointerWorldX - this.x;
        let velocityY = pointerWorldY - this.y;
        let magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        velocityX /= magnitude;
        velocityY /= magnitude;
        velocityX *= 400;
        velocityY *= 400;
        bullet.setVelocity(velocityX, velocityY);
        bullet.setCollideWorldBounds(true);
        bullet.body.allowGravity = false;
    
        this.scene.physics.add.collider(bullet, this.scene.platforms, function(bullet, platform) {
            // Handle the collision between the bullet and a platform
            bullet.destroy();
        });

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