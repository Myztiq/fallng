ig.module(
  'game.entities.missiles'
)
  .requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
  .defines(function() {
    EntityMissiles = GenericEntity.extend({
      size: {x:32, y:32},
      animSheet: new ig.AnimationSheet( 'media/Missiles.png', 32, 32 ),
      init: function(x, y, settings) {
        this.addAnim( 'idle', 1, [Math.floor(Math.random()*4)] );
        this.parent(x, y, settings);
        if(settings.rotate){
          this.anims.idle.angle = settings.rotate;
        }
      }
    });
    ig.EntityPool.enableFor( EntityMissiles );
  });