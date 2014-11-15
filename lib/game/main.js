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
  'game.entities.big-ufo',
  'game.entities.small-ufo',
  'game.entities.airplane',
  'game.entities.hot-air-balloon',
  'game.entities.hot-air-balloon-big',
  'game.entities.missiles',
  'game.entities.poison-clouds',
  'game.entities.birds',
  'game.entities.signs',
  'game.entities.stars',

  'game.levels.menu',
  'impact.debug.debug'

)
  .defines(function(){

    MyGame = ig.Game.extend({
      levelTimer: new ig.Timer(),
      gamepad: new ig.GamepadDualshock(),
      background: new ig.Image( 'media/Background-Proper.png' ),
      landingPadImage: new ig.Image( 'media/Ground.png' ),
      topOffset: 0,
      isDone: false,

      levelTypeLengths: {
        thermosphere: 4,
        stratosphere: 4,
        upperAtmosphere: 4,
        cityScape: 4
      },
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
        var map = [];
        for(var i=1;i<this.levelTypeLengths.thermosphere;i++){
          map.push([2]);
        }
        map.push([1]);
        for(var i=1;i<this.levelTypeLengths.stratosphere;i++){
          map.push([4]);
        }
        map.push([3]);
        for(var i=1;i<this.levelTypeLengths.upperAtmosphere;i++){
          map.push([6]);
        }
        map.push([5]);
        for(var i=1;i<this.levelTypeLengths.cityScape;i++){
          map.push([8]);
        }
        map.push([10]);
        var bgmap = new ig.BackgroundMap( 800, map, this.background );
        bgmap.distance = 10;

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

        var calculatePercentBoxes = function(weights){
          var total = 0;

          for(var i = 0; i < weights.length; i++){
            total += weights[i].frequency;
          }

          var percentBoxes = {};
          var currentPercentBox = 0;
          for(var i = 0; i < weights.length; i++){
            var entity = weights[i];
            currentPercentBox = entity.frequency/total + currentPercentBox;
            percentBoxes[currentPercentBox] = entity;
          }
          return percentBoxes;
        }

        var weights = [
          {
            entity: EntitySmallMeteor,
            frequency: 10,
            name: 'small meteor',
            rotate: Math.PI
          },
          {
            entity: EntitySpaceMine,
            frequency: 10,
            name: 'space mine',
            rotate: Math.PI
          },
          {
            entity: EntityBigMeteor,
            frequency: 5,
            name: 'big meteor',
            rotate: Math.PI
          },
          {
            entity: EntityBigUFO,
            frequency:.5,
            name: 'big ufo',
            rotate: 30 * Math.PI / 180
          },
          {
            entity: EntitySmallUFO,
            frequency: 1,
            name: 'small ufo',
            rotate: 20 * Math.PI / 180
          }
        ];

        this.thermospherePercentBoxes = calculatePercentBoxes(weights);


        var weights = [
          {
            entity: EntitySpySatellite,
            frequency: 3,
            name: 'spy satellite',
            rotate: Math.PI
          },
          {
            entity: EntitySmallMeteor,
            frequency: 10,
            name: 'small meteor',
            rotate: Math.PI
          },
          {
            entity: EntityBigMeteor,
            frequency: 5,
            name: 'big meteor',
            rotate: Math.PI
          },
          {
            entity: EntityBigUFO,
            frequency:.5,
            name: 'big ufo',
            rotate: 30 * Math.PI / 180
          },
          {
            entity: EntitySmallUFO,
            frequency: 1,
            name: 'small ufo',
            rotate: 20 * Math.PI / 180
          },
          {
            entity: EntityMissiles,
            frequency: 3,
            name: 'Missiles',
            rotate: 20 * Math.PI / 180
          }
        ];
        this.stratospherePercentBoxes = calculatePercentBoxes(weights);





        var weights = [
          {
            entity: EntityHotAirBalloon,
            frequency: 10,
            name: 'hot air baloon',
            rotate: 30 * Math.PI / 180
          },
          {
            entity: EntityHotAirBalloonBig,
            frequency: 2,
            name: 'big hot air baloon',
            rotate: 30 * Math.PI / 180
          },
          {
            entity: EntityAirplane,
            frequency: 10,
            name: 'airplane',
            rotate: 30 * Math.PI / 180
          },
          {
            entity: EntityMissiles,
            frequency: 10,
            name: 'Missiles',
            rotate: 20 * Math.PI / 180
          }
        ];

        this.upperAtmospherePercentBoxes = calculatePercentBoxes(weights);




        var weights = [
          {
            entity: EntityAirplane,
            frequency: 2,
            name: 'airplane',
            rotate: 30 * Math.PI / 180
          },
          {
            entity: EntityPoisonClouds,
            frequency: 10,
            name: 'poison clouds',
            rotate: 20 * Math.PI / 180
          },
          {
            entity: EntityBirds,
            frequency: 10,
            name: 'birds',
            rotate: 20 * Math.PI / 180
          },
          {
            entity: EntitySigns,
            frequency: 4,
            name: 'Signs'
          }
        ];

        this.cityScapePercentBoxes = calculatePercentBoxes(weights);



      },
      spawnPosition: 0,
      update: function() {
        // Update all entities and backgroundMaps
        this.parent();

        var bg = this.backgroundMaps[0];

        var time = Math.floor(this.levelTimer.delta());
        if(time >= 0){
          $('.timer').html(time);
        }

        var totalBgHeight = bg.data.length * 800 * bg.distance;
        var maxScreenHeight = totalBgHeight - 600 * bg.distance;
        // Dont move past the max height
        if(this.screen.y >= maxScreenHeight){
          this.screen.y = maxScreenHeight;
          return;
        } else{
          var maxRange = 140;
          var movementRange = (-(this.player.vel.y/this.player.maxVel.y + 1) * maxRange) + maxRange;
          if(movementRange - this.lastMovement > 5){
            movementRange = this.lastMovement + 5;
          }
          this.screen.y = this.player.pos.y - movementRange - 200;
        }

        if(Math.random() > .8 && this.currentLevel == 'thermosphere'){
          this.spawnEntity(EntityStars, Math.random()*800, this.player.pos.y + 500);
        }
        //Span shit
        if(Math.random() > .95 && this.spawnPosition < this.player.pos.y + 500){
          this.spawnPosition = this.player.pos.y + 500 + Math.random() * 200;

          var prevLevel = 0;
          if((prevLevel = this.levelTypeLengths.thermosphere * 800 * bg.distance) > this.player.pos.y) {
            console.log('Thermosphere');
            this.currentLevel = "thermosphere";
            var percentBoxes = this.thermospherePercentBoxes;

          } else if((prevLevel = prevLevel + this.levelTypeLengths.stratosphere * 800 * bg.distance) > this.player.pos.y) {
            this.currentLevel = "stratosphere";
            console.log('Stratosphere');
            var percentBoxes = this.stratospherePercentBoxes;
          } else if((prevLevel = prevLevel + this.levelTypeLengths.upperAtmosphere * 800 * bg.distance) > this.player.pos.y) {
            this.currentLevel = "upperAtmosphere";
            console.log('Upper Atmosphere');
            var percentBoxes = this.upperAtmospherePercentBoxes;
          } else if((prevLevel = prevLevel + this.levelTypeLengths.cityScape * 800 * bg.distance) > this.player.pos.y) {
            this.currentLevel = "cityScape";

            console.log('City Scape');
            var percentBoxes = this.cityScapePercentBoxes;
          }


          var rand = Math.random();
          var percentKeys = Object.keys(percentBoxes);
          percentKeys = percentKeys.sort()
          for(var i=0;i<percentKeys.length;i++){
            if(rand < parseFloat(percentKeys[i])){
              var entity = percentBoxes[percentKeys[i]];
              break;
            }
          }
          var spawnMaxVelocity = 100;
          var rotate = entity.rotate * Math.random() - entity.rotate / 2;
          this.spawnEntity(entity.entity, Math.random()*800, this.spawnPosition, {rotate: rotate, vel: {x: spawnMaxVelocity*(Math.random() -.5), y:  spawnMaxVelocity*(Math.random() -.5)}});

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
