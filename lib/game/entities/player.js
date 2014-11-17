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
    defaultSizeMin: {x:20, y:48}, // set the min x to box's smallest possible size 
    defaultSizeMax: {x:48, y:48},
    size: {x:48, y:84},
    defaultOffset: {x:72, y:98}, 
    offset: {x: 72, y: 98},
    collides: ig.Entity.COLLIDES.ACTIVE,

    height: 118,
    lastDirX: 0,
    gravity: 1,
    parachuteEnabled: false,
    didTriggerParachuteYet: false,
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
    defaultFriction: {
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
        ig.game.fin(!this.parachuteEnabled);
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

      this.checkDirection( ig.input );
      this.updateCollisionBox(); // resizes the box based on how fast player is going
  
      // handles parachute toggling on user input: (space or accelY)
      var minAccelYTriggerToggle = 9;
      var isParachuteTriggered = (ig.input.accel.y > minAccelYTriggerToggle);
      var isParachuteUnTriggered = (ig.input.accel.y < (minAccelYTriggerToggle-4));
      if ( isParachuteUnTriggered && this.didTriggerParachuteYet )
      {
        /// untrigger it, since th euser put the device back down
        this.didTriggerParachuteYet = false;
      }

      var shouldToggle = isParachuteTriggered && !this.didTriggerParachuteYet;
      if ( shouldToggle || ig.input.pressed('parachute-toggle') )
      {
        this.onToggleParachute(); // updates friction, defaultFriction, this.vel.y
        this.didTriggerParachuteYet = true;
      }

      /* slowly return current friction to the "default" friction */
      var friction_diff = this.defaultFriction.y - this.friction.y;
      if ( friction_diff > 1 ) {
        this.friction.y += friction_diff / 2;
      }
      else {
        this.friction.y = this.defaultFriction.y; 
      }

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
    updateCollisionBox: function () {
      /* update collision box: the faster the player goes then lets make 
        it slightly easier to dodge obstacles by shrinking the collision box */
        var scale = this.vel.y / this.maxVel.y;
        var maxSizeDiff = (this.defaultSizeMax.x - this.defaultSizeMin.x);
        this.size.x = this.defaultSizeMax.x - scale * maxSizeDiff; // update size
        this.offset.x = this.defaultOffset.x + ((this.defaultSizeMax.x - this.size.x) / 2);

    },
    onToggleParachute: function () {
      if ( this.parachuteCount == 0 )
      {
        return;
      }

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
      this.defaultFriction.y = this.friction.y;
    },
    checkDirection: function( input ) {
      if (!input) {
        return;
      }

      if ( input.accel.x || input.accel.y )
      {
        /* set the view with the accel */
        $('#sensorAccelX').html(ig.input.accel.x);
        $('#sensorAccelY').html(ig.input.accel.y);
        $('#sensorAccelZ').html(ig.input.accel.z);

        var maxMagnitude = 5; // far as it goes on my device 
        var accelScalar = 100; 
        var accelX = ig.input.accel.x;
        var magnitude = -Math.max(0, Math.log(Math.abs(accelX/2)) + Math.E); // no negative
        if( input.state('left') || input.accel.x < 0) {
          this.accel.x = Math.min(1, (magnitude / maxMagnitude)) * -this.speed; 
        } else if( input.state('right') || input.accel.x > 0 ) {
          this.accel.x = Math.min(1, (magnitude / maxMagnitude)) * this.speed; 
        } else {
          this.accel.x = 0;
        } 
      }
      else
      {
        if( input.state('left') ) {
          this.onGoLeft();
        } else if( input.state('right') ) {
          this.onGoRight();
        } else {
          this.accel.x = 0;
        } 
      }
    },
    onGoLeft: function (magnitude) {
      this.accel.x = -this.speed;
    },
    onGoRight: function (magnitude) {
      this.accel.x = this.speed;
    },


    bounce: function(other){
      ig.game.hits++;
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
