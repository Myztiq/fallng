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
    size: {x:96, y:96},
    collides: ig.Entity.COLLIDES.ACTIVE,

    speed: 600,
    gravity: 1,
    parachuteState: 1,
    parachuteDragFactor: 2,
    maxVel: {
      x: 400,
      y: 100000
    },
    friction:{
      x: 100,
      y: 100
    },
    type: ig.Entity.TYPE.A,

    animSheet: new ig.AnimationSheet( 'media/Character-Falling.png', 96, 96 ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'fall', 0.07, [0]);
      this.parachuteState = PARACHUTE_DISABLED;
      this.accel.y = 100;
      this.vel.y = 0;
    },

    update: function() {
      if ( ig.input.state('parachute-toggle') ) {
        if ( this.getParachuteState() != PARACHUTE_ENABLED )
        {
          this.setParachuteState(PARACHUTE_ENABLED);
          this.vel.y = this.vel.y / this.parachuteDragFactor;
          this.accel.y = 100 / this.parachuteDragFactor;
        }
        else 
        {
          this.setParachuteState(PARACHUTE_DISABLED);
          this.accel.y = 100;
        }
      }
      
      this.checkDirection( ig.input );
      // on collision?

      this.currentAnim = this.anims.fall;
      this.parent();
    },
    setParachuteState: function( state ) {
      this.parachuteState = state;
    },
    getParachuteState: function( ) {
      return this.parachuteState;
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
      this.vel.y = 0;
    }

  });
});
