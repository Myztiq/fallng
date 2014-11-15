var score = 0;

ig.module(
  'game.main'
)
.requires(
  'impact.game',
  'impact.font',
  'plugins.impact-splash-loader',
  'plugins.gamepad-dualshock',

  'game.entities.player',
  'game.entities.wall',
  'game.entities.small-meteor',
  'game.entities.big-meteor',
  'game.entities.space-mine',
  'game.entities.spy-satellite',

  'game.levels.menu',
  'impact.debug.debug'

)
.defines(function(){

MyGame = ig.Game.extend({
  levelTimer: new ig.Timer(),
  gamepad: new ig.GamepadDualshock(),
  background: new ig.Image( 'media/Background.png' ),
  landingPadImage: new ig.Image( 'media/Ground.png' ),
  init: function() {
    this.gamepad
      .bind(ig.DUALSHOCK_KEY.LEFT, 'left')
      .bind(ig.DUALSHOCK_KEY.LS_LEFT, 'left')
      .bind(ig.DUALSHOCK_KEY.RIGHT, 'right')
      .bind(ig.DUALSHOCK_KEY.LS_RIGHT, 'right')
      .bind(ig.DUALSHOCK_KEY.UP, 'up')
      .bind(ig.DUALSHOCK_KEY.LS_UP, 'up')
      .bind(ig.DUALSHOCK_KEY.DOWN, 'down')
      .bind(ig.DUALSHOCK_KEY.LS_DOWN, 'down')
      .bind(ig.DUALSHOCK_KEY.CROSS, 'cluster')
      .bind(ig.DUALSHOCK_KEY.SQUARE, 'decluster')
    ;

    ig.input.bind( ig.KEY.W, 'up' );
    ig.input.bind( ig.KEY.S, 'down' );
    ig.input.bind( ig.KEY.A, 'left' );
    ig.input.bind( ig.KEY.D, 'right' );
    ig.input.bind( ig.KEY.SPACE, 'parachute-toggle' );

    ig.input.bind(ig.KEY.K, 'cluster');
    ig.input.bind(ig.KEY.L, 'decluster');


    /// set the sky background image
    var backgroundLength =  8000/800;
    var map = [];
    for(var i=1;i<=backgroundLength;i++){
      map.push([i]); // push vertically
    }
    console.log(map);
    var bgmap = new ig.BackgroundMap( 800, map, this.background );
    bgmap.distance = 5;

    // set the landing pad background image
    // var numtilesInLandingPadX = 800/100;
    // var landingPadMap = [];
    // for(var i=1; i <= numtilesInLandingPadX; i++){
    //   landingPadMap.push(i); // push horizontally
    // }
    // console.log(landingPadMap);
    // var landingPadMapBg = new ig.BackgroundMap(100, numtilesInLandingPadX, this.landingPadImage );
    // landingPadMapBg.distance = bgmap.distance;


    // Add the bgmap to the Game's array of BackgroundMaps
    // so it will be automatically drawn by .draw()
    this.backgroundMaps.push( bgmap );
    this.player = this.spawnEntity(EntityPlayer, 350, 10);
    this.player.setLanded(false);
  },
  spawnPosition: 0,
  update: function() {
    // Update all entities and backgroundMaps
    this.parent();

    var bg = this.backgroundMaps[0];
    var curBgPos = this.screen.y / bg.distance;
    // console.log(curBgPos);

    var time = Math.floor(this.levelTimer.delta());
    if(time >= 0){
      $('.timer').html(time);
    }

    var screenHeight = 600;
    if ( curBgPos < (bg.data.length * 800) - screenHeight )
    {
      var maxRange = 140;
      var movementRange = (-(this.player.vel.y/this.player.maxVel.y + 1) * maxRange) + maxRange;
      if(movementRange - this.lastMovement > 5){
        movementRange = this.lastMovement + 5;
      }
      this.screen.y = this.player.pos.y - movementRange - 200;
    }
    else
    {

    }

    this.lastMovement = movementRange;

    // update space artifacts
    if(Math.random() > .95 && this.spawnPosition < this.player.pos.y + 500){
      this.spawnPosition = this.player.pos.y + 500 + Math.random() * 200;
      var isSpace = true;
      if(isSpace){
        var rand = Math.random()
        var entity = EntitySmallMeteor;
        if(rand < .06){
          entity = EntitySpySatellite;
        }else if(rand < .4){
          entity = EntityBigMeteor;
        } else {
          if(Math.random() < .5){
            entity = EntitySpaceMine;
          }else{
            entity = EntitySmallMeteor;
          }
        }
        var spawnMaxVelocity = 100;
        this.spawnEntity(entity, Math.random()*800, this.spawnPosition, {vel: {x: spawnMaxVelocity*(Math.random() -.5), y:  spawnMaxVelocity*(Math.random() -.5)}});
      }

    }
  },
  shake: function(intensity){
    var _self = this;
    this.shakeAmplitude = 20 * intensity;
    setTimeout(function(){
      _self.shakeAmplitude = 0;
    }, 70 + 100 * intensity)
  },
  shakeAmplitude : 0,
  draw : function() {

    var ctx = ig.system.context;
    // translate the context if shakeAmplitude not null;
    if (this.shakeAmplitude) {
      ctx.save();
      ctx.translate(this.shakeAmplitude*(Math.random()-0.5) ,
        this.shakeAmplitude*(Math.random()-0.5)   );
      var degrees =  this.shakeAmplitude*(Math.random()-0.5) / 2;

      $('canvas').css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
          '-moz-transform' : 'rotate('+ degrees +'deg)',
          '-ms-transform' : 'rotate('+ degrees +'deg)',
          'transform' : 'rotate('+ degrees +'deg)'});
    }else{
      var degrees = 0;
      $('canvas').css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
        '-moz-transform' : 'rotate('+ degrees +'deg)',
        '-ms-transform' : 'rotate('+ degrees +'deg)',
        'transform' : 'rotate('+ degrees +'deg)'});

    }

    this.parent();         //  or ig.Game.draw.call(this);

    if (this.shakeAmplitude) {
      ctx.restore();
    }

  }
});


ig.main( '#canvas', MyGame, 60, 800, 600, 1, ig.ImpactSplashLoader);

});
