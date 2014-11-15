ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity',
  'impact.timer'
)
.defines(function(){

  var PARACHUTE_DISABLED = 0;
  var PARACHUTE_ENABLED = 1;

  var DIR_LEFT = -1;
  var DIR_RIGHT = 1;

  EntityPlayer = ig.Entity.extend({
    size: {x:56, y:92},
    offset: {x: 68, y: 90},
    collides: ig.Entity.COLLIDES.ACTIVE,

<<<<<<< HEAD
    curDirX: 0, // -1 or 1
    lastDirX: 0,
=======
    speed: 1600,
>>>>>>> 6d9b247e51e08098cee668f19e75a3cc180b3fce
    gravity: 1,
    parachuteEnabled: false,
    parachuteDragFactor: 2,
    timer: new ig.Timer(),
    speed: 600,
    bounceBackMult: 10,
    minVel: {
      x: 0,
      y: 400
    },
    maxVel: {
<<<<<<< HEAD
      x: 400,
      y: 1000
    },
    default_friction: {
      x: 80,
      y: 120
    },
    friction:{
      x: 80,
      y: 120
    },
    minFriction: {
      x: 0,
      y: 50
    },
    maxFriction: {
      x: 0,
      y: 200
    },
    accel: {
      x: 0,
      y: 150
    },
    minAccel: {
      x: 0,
=======
      x: 500,
      y: 900
    },
    friction:{
      x: 400,
>>>>>>> 6d9b247e51e08098cee668f19e75a3cc180b3fce
      y: 100
    },
    maxAccel: {
      x: 0,
      y: 250
    },
    type: ig.Entity.TYPE.A,
    isFirstHit: true,

    animSheet: new ig.AnimationSheet( 'media/Character.png', 192, 192 ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'fall', 0.07, [0]);
      this.addAnim( 'chute', 0.07, [1]);
      this.anims.chute.pivot.y = 144;
      this.anims.fall.pivot.y = 144;
      this.parachuteEnabled = false;

      this.timer.init(0);
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

      var friction_diff = this.default_friction.y - this.friction.y;
      if ( friction_diff > 1 ) {
        this.friction.y += friction_diff / 2;
      }
      else {
        this.friction.y = this.default_friction.y; 
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
    getHitMultiplier: function( direction ) {
      var intensityMultiplier = 1;

      if ( direction == this.lastDirX ) {
        var delta = this.timer.tick();
        if ( this.isFirstHit ) {
          this.isFirstHit = false;
          this.timer.reset();
        }
        else if ( delta < 2 )
        {
          intensityMultiplier == 2;  
          this.isFirstHit = true;
        }
        else 
        {
          this.isFirstHit = true;
        }
      }

      if (direction == DIR_LEFT)
      {
        intensityMultiplier *= -1;
      }
      else if(direction == DIR_RIGHT)
      {
        intensityMultiplier *= 1;
      }

      this.lastDirX = direction;
      return intensityMultiplier;
    },
    onGoLeft: function () {
      this.curDirX = DIR_LEFT;
      var multiplier = 1;// = this.getHitMultiplier(this.curDirX);

      this.accel.x = -this.speed;

      // if ( this.vel.x > 0 ) { // going right, change directions
      //   this.accel.x = -100;
      // }
      // else 
      // {
      //   this.vel.x *= multiplier;
      // }
    },
    onGoRight: function () {
      this.curDirX = DIR_RIGHT;
      var multiplier = 1;// = this.getHitMultiplier(this.curDirX);

      this.accel.x = this.speed;

      // if ( this.accel.x < 0 ) { // going left, change directions
      //   this.accel.x = 100;
      // }
      // else 
      // {
      //   this.vel.x *= multiplier;
      // }
    },
    collision: function ( other ) {
      // get state and pass
      var collision_state = 0;
      // other.OnCollide( collision_state );
      this.parent();
    },
    bounce: function(){
<<<<<<< HEAD
      this.vel.y = this.minVel.y;
      this.friction.y = this.minFriction.y;
=======
      var intensity = this.vel.y / this.maxVel.y;
      this.vel.y = 0;
      ig.game.shake(intensity);
>>>>>>> 6d9b247e51e08098cee668f19e75a3cc180b3fce
    }

  });
});
