export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key) {
      super(scene, x, y, key);
  
      // Add the player sprite to the scene and enable physics
      scene.add.existing(this);
      scene.physics.add.existing(this);
  
      // Set player properties
      this.setCollideWorldBounds(true);
      this.setBounce(0.2);
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.setScale(0.5);
    }
  
    update() {

        if (this.cursors.left.isDown)
        {
            this.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.setVelocityX(300);
        }
        else
        {
            this.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.body.touching.down)
        {
            this.setVelocityY(-500);
        }
    }
  }