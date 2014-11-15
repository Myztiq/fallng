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

  'game.levels.menu',
  'impact.debug.debug'

)
.defines(function(){

MyGame = ig.Game.extend({
  levelTimer: new ig.Timer(),
  gamepad: new ig.GamepadDualshock(),
  background: new ig.Image( 'media/Background.png' ),
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

    var backgroundLength =  8000/800;
    var map = [];
    for(var i=1;i<backgroundLength;i++){
      map.push([i]);
    }

    var bgmap = new ig.BackgroundMap( 800, map, this.background );
    bgmap.distance = 5;

    // Add the bgmap to the Game's array of BackgroundMaps
    // so it will be automatically drawn by .draw()
    this.backgroundMaps.push( bgmap );
    this.player = this.spawnEntity(EntityPlayer, 30, 16);
  },
  spawnPosition: 0,
  update: function() {
    // Update all entities and backgroundMaps
    this.parent();

    var time = Math.floor(this.levelTimer.delta());
    if(time >= 0){
      $('.timer').html(time);
    }
    this.screen.y = this.player.pos.y - 256;

    if(Math.random() > .95 && this.spawnPosition < this.player.pos.y + 500){
      this.spawnPosition = this.player.pos.y + 500 + Math.random() * 200;
      this.spawnEntity(EntityWall, Math.random()*800, this.spawnPosition);
    }

  },

  draw: function() {
    // Draw all entities and backgroundMaps
    this.parent();
  }
});


ig.main( '#canvas', MyGame, 60, 800, 600, 1, ig.ImpactSplashLoader);

});
