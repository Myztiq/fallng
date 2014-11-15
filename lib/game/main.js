var score = 0;

ig.module(
  'game.main'
)
.requires(
  'impact.game',
  'impact.font',
  'plugins.impact-splash-loader',
  'plugins.director.director',
  'plugins.gamepad-dualshock',

  'game.entities.drone',

  'game.levels.menu',
  'game.levels.main'

)
.defines(function(){

MyGame = ig.Game.extend({

  // Load a font
  font: new ig.Font( 'media/04b03.font.png' ),


  levelTimer: new ig.Timer(),
  gamepad: new ig.GamepadDualshock(),
  init: function() {
    var self = this;


    this.gamepad
      .bind( ig.DUALSHOCK_KEY.LEFT        , 'left' )
      .bind( ig.DUALSHOCK_KEY.LS_LEFT     , 'left' )
      .bind( ig.DUALSHOCK_KEY.RIGHT       , 'right' )
      .bind( ig.DUALSHOCK_KEY.LS_RIGHT    , 'right' )
      .bind( ig.DUALSHOCK_KEY.UP          , 'up' )
      .bind( ig.DUALSHOCK_KEY.LS_UP       , 'up' )
      .bind( ig.DUALSHOCK_KEY.DOWN        , 'down' )
      .bind( ig.DUALSHOCK_KEY.LS_DOWN     , 'down' )
      .bind( ig.DUALSHOCK_KEY.CROSS       , 'cluster' )
      .bind( ig.DUALSHOCK_KEY.SQUARE      , 'decluster' )
    ;

    ig.input.bind( ig.KEY.W, 'up' );
    ig.input.bind( ig.KEY.S, 'down' );
    ig.input.bind( ig.KEY.A, 'left' );
    ig.input.bind( ig.KEY.D, 'right' );

    ig.input.bind( ig.KEY.K, 'cluster' );
    ig.input.bind( ig.KEY.L, 'decluster' );

    this.myDirector = new ig.Director(this, [LevelMenu, LevelMain, LevelMenu]);
    var $intro = $('.intro');
    $intro.addClass('active').one('click',function(){
      $intro.removeClass('active');
      self.myDirector.nextLevel()
    })
  },
  loadLevel: function(level){
    this.parent(level);
    if(this.myDirector){
      if(this.myDirector.currentLevel % 2 == 1){
        $('.hud').addClass('active');
        $('.level-end').removeClass('active');
      } else if(this.myDirector.currentLevel > 1){
        $('.hud').removeClass('active');
        if(this.myDirector.currentLevel == this.myDirector.levels.length - 1){
          $('.game-end').addClass('active')
        }else{
          $('.level-end').addClass('active').one('click', function(){
            ig.game.myDirector.nextLevel()
          })
        }
      }
    }
    this.levelTimer.set(60);
  },
  update: function() {
    // Update all entities and backgroundMaps
    this.parent();

    if(this.myDirector.currentLevel % 2 == 1){
      var time = Math.floor(this.levelTimer.delta() * -1);
      if(time >= 0){
        $('.timer').html(time);
      }
      // Add your own, additional update code here
      var drones = ig.game.getEntitiesByType('EntityDrone');
      if(drones.length == 0){
        this.myDirector.nextLevel();
        return;
      }
      var totalX = 0;
      var totalY = 0;
      drones.forEach(function(drone){
        totalX += drone.pos.x;
        totalY += drone.pos.y;
      });

      this.averageDroneCenter = {
        x: totalX / drones.length,
        y: totalY / drones.length
      };

      this.screen.x = this.averageDroneCenter.x - ig.system.width / 2;
      this.screen.y = this.averageDroneCenter.y - ig.system.height / 2;
    }else if(ig.input.state('cluster')){
      $('.level-end').click();
      $('.intro').click();
    }
  },

  draw: function() {
    // Draw all entities and backgroundMaps
    this.parent();
  }
});


ig.main( '#canvas', MyGame, 60, 960, 496, 1, ig.ImpactSplashLoader);

});
