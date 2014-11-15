ig.module(
  'game.entities.hot-air-balloon'
)
  .requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
  .defines(function() {
    EntityHotAirBalloon = GenericEntity.extend({
      size: {x:64, y:64},
      animSheet: new ig.AnimationSheet( 'media/Hot-Air-Balloon.png', 64, 64 ),
      init: function(x, y, settings) {
        this.addAnim( 'idle', 1, [Math.floor(Math.random()*7)] );
        this.parent(x, y, settings);
        if(settings.rotate){
          this.anims.idle.angle = settings.rotate;
        }
      },
    });
    ig.EntityPool.enableFor( EntityHotAirBalloon );
  });