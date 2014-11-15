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

    height: 118,
    lastDirX: 0,
    gravity: 1,
    parachuteEnabled: false,
    parachuteDragFactor: 3,
    timer: new ig.Timer(),
    speed: 4000,
    bounceBackMult: 10,
    parachuteCount: 3,
    minVel: {
      x: 0,
      y: 400
    },
    maxVel: {
      x: 800,
      y: 2000
    },
    maxVelDefault :
    {
      x: 800,
      y: 1000
    },
    target_friction: {
      x: 80,
      y: 120
    },
    friction:{
      x: 5000,
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
      y: 50
    },
    maxAccel: {
      x: 150,
      y: 250
    },
    type: ig.Entity.TYPE.A,
    isFirstHit: true,
    isLanded: false,

    animSheet: new ig.AnimationSheet( 'media/Character.png', 192, 192 ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'fall', 0.07, [4]);
      this.addAnim( 'chute', 0.07, [0]);
      this.addAnim( 'landed', 0.15, [0,1,2,3], true);
      this.addAnim( 'death', 0.15, [4,5,6], true);
      this.anims.chute.pivot.y = 144;
      this.anims.fall.pivot.y = 144;
      this.parachuteEnabled = false;

      this.vel.y = 10;

      this.timer.init(0);
    },
    onLanded: function() {
        // end game
        if ( this.isLanded ) {
          return;
        }else{
          if(this.parachuteEnabled){
            this.currentAnim = this.anims.landed;
          }else{
            this.currentAnim = this.anims.death;
          }
          this.currentAnim.rewind();
        }

      if (!this.isLanded) {
        this.deathPos = this.pos.x;
        this.isLanded = true;
      }
    },
    update: function() {
      var bgmap = ig.game.backgroundMaps[0];
      var totalBgHeight = bgmap.data.length * 800 * bgmap.distance;
      var maxCharacterHeight = totalBgHeight - 600 * bgmap.distance + 600;

      if (this.pos.y + this.height >= maxCharacterHeight ){
        this.parent();
        this.pos.y = maxCharacterHeight - this.height;
        this.vel.x = 0;
        this.vel.y = 0;
        if(this.deathPos){
          this.pos.x = this.deathPos;
        }

        this.onLanded();
        return;
      }

      if ( this.parachuteCount > 0 && ig.input.pressed('parachute-toggle') ) {
        if ( this.parachuteEnabled ) {
          // decrease number of parachutes when we cut it off 
          this.parachuteCount -= 1; 
          this.parachuteEnabled = false;
          this.friction.y /= this.parachuteDragFactor;
          this.maxVel.y *= this.parachuteDragFactor;
        } else {
          this.parachuteEnabled = true;
          this.vel.y /= this.parachuteDragFactor;
          this.friction.y *= this.parachuteDragFactor;
          this.maxVel.y /= this.parachuteDragFactor;
        }
        this.target_friction.y = this.friction.y;
      }

      var friction_diff = this.target_friction.y - this.friction.y;
      if ( friction_diff > 1 ) {
        this.friction.y += friction_diff / 2;
      }
      else {
        this.friction.y = this.target_friction.y; 
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

      if(this.flash){
        this.anims.fall.alpha = Math.random();
        this.anims.chute.alpha = Math.random();
      }else{
        this.anims.fall.alpha = 1;
        this.anims.chute.alpha = 1;
      }

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
    },
    onGoRight: function () {
      this.accel.x = this.speed;
    },


    bounce: function(other){
      var self = this;
      this.vel.y = this.minVel.y;
      this.friction.y = this.minFriction.y;
      var intensity = this.vel.y / this.maxVel.y;
      ig.game.shake(intensity);
      this.flash = true;
      setTimeout(function(){
        self.flash = false;
      }, 200 + 500 * intensity);


      var angle = this.angleTo(other);
      var x = Math.cos(angle);
      var hitVel = 1000;
      this.vel.x = -x * hitVel;
    },
    setLanded: function( isLanded ){
      this.isLanded = isLanded;
    }

  });
});
