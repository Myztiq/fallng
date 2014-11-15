ig.module(
  'game.entities.hot-air-balloon-big'
)
  .requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
  .defines(function() {
    EntityHotAirBalloonBig = GenericEntity.extend({
      size: {x:128, y:128},
      animSheet: new ig.AnimationSheet( 'media/Hot-Air-Balloon-Big.png', 128, 128 ),
      init: function(x, y, settings) {
        this.addAnim( 'idle', 1, [Math.floor(Math.random()*7)] );
        this.parent(x, y, settings);
        if(settings.rotate){
          this.anims.idle.angle = settings.rotate;
        }
      },
    });
    ig.EntityPool.enableFor( EntityHotAirBalloonBig );
  });