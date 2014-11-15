ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity'
)
.defines(function(){

  EntityPlayer = ig.Entity.extend({
    size: {x:32, y:32},
    collides: ig.Entity.COLLIDES.ACTIVE,

    speed: 600,
    gravity: 1,
    prevVel: {
      x: 0,
      y: 0
    },
    maxVel: {
      x: 400,
      y: 100000
    },
    friction:{
      x: 100,
      y: 100
    },
    type: ig.Entity.TYPE.A,

    animSheet: new ig.AnimationSheet( 'media/zombie.png', 32, 32 ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'fall', 0.07, [0]);
    },

    update: function() {
      if( ig.input.state('left') ) {
        this.accel.x = -this.speed;
      } else if( ig.input.state('right') ) {
        this.accel.x = this.speed;
      } else {
        this.accel.x = 0;
      }

      this.accel.y = 100;

      this.currentAnim = this.anims.fall;
      this.parent();
    },
    bounce: function(){
      this.vel.y = -200;
    }

  });
});
