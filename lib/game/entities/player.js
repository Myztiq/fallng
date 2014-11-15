ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity'
)
.defines(function(){

  var PARACHUTE_DISABLED = 0;
  var PARACHUTE_ENABLED = 1;

  EntityPlayer = ig.Entity.extend({
    size: {x:56, y:92},
    offset: {x: 68, y: 90},
    collides: ig.Entity.COLLIDES.ACTIVE,

    speed: 1600,
    gravity: 1,
    parachuteEnabled: false,
    parachuteDragFactor: 2,
    maxVel: {
      x: 500,
      y: 900
    },
    friction:{
      x: 400,
      y: 100
    },
    type: ig.Entity.TYPE.A,

    animSheet: new ig.AnimationSheet( 'media/Character.png', 192, 192 ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'fall', 0.07, [0]);
      this.addAnim( 'chute', 0.07, [1]);
      this.anims.chute.pivot.y = 144;
      this.anims.fall.pivot.y = 144;
      this.parachuteEnabled = false;
      this.accel.y = 100;
      this.vel.y = 0;
    },

    update: function() {
      if ( ig.input.pressed('parachute-toggle') ) {
        if ( this.parachuteEnabled ){
          this.parachuteEnabled = false;
          this.vel.y = this.vel.y / this.parachuteDragFactor;
          this.accel.y = 100 / this.parachuteDragFactor;
        } else {
          this.parachuteEnabled = true;
          this.accel.y = 100;
        }
      }
      
      this.checkDirection( ig.input );
      // on collision?

      if(this.parachuteEnabled){
        this.currentAnim = this.anims.chute;
      }else{
        this.currentAnim = this.anims.fall;
      }

      var maxPos = 800 - this.size.x;
      var minPos = 0;
      if(this.pos.x < minPos){
        this.pos.x = minPos;
        this.vel.x = 0;
      }else if(this.pos.x > maxPos){
        this.pos.x = maxPos;
        this.vel.x = 0;
      }

      var maxAngle = .5;

      var movementAngle = this.vel.x/this.maxVel.x * maxAngle * -1;
      this.anims.chute.angle = movementAngle;
      this.anims.fall.angle = movementAngle;


      this.parent();
    },
    checkDirection: function( input ) {
      if( input.state('left') ) {
        this.onGoLeft();
      } else if( input.state('right') ) {
        this.onGoRight();
      } else {
        this.accel.x = 0;
      } 
    },
    onGoLeft: function () {
      this.accel.x = -this.speed;
      if ( this.vel.x > 0 ) { // going right, change directions
        this.accel.x *= 2;
      }
    },
    onGoRight: function () {
      this.accel.x = this.speed;
      if ( this.vel.x < 0 ) { // going left, change directions
        this.accel.x *= 2;
      }
    },
    collision: function ( other ) {
      // get state and pass
      var collision_state = 0;
      // other.OnCollide( collision_state );
      this.parent();
    },
    bounce: function(){
      var intensity = this.vel.y / this.maxVel.y;
      this.vel.y = 0;
      ig.game.shake(intensity);
    }

  });
});
