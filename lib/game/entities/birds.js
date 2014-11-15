ig.module(
  'game.entities.birds'
)
  .requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
  .defines(function() {
    EntityBirds = GenericEntity.extend({
      size: {x:32, y:32},
      animSheet: new ig.AnimationSheet( 'media/Birds.png', 32, 32 ),
      init: function(x, y, settings) {
        this.addAnim( 'idle', 1, [Math.floor(Math.random()*4)] );
        this.parent(x, y, settings);
        if(settings.rotate){
          this.anims.idle.angle = settings.rotate;
        }
      }
    });
    ig.EntityPool.enableFor( EntityBirds );
  });