ig.module(
  'game.entities.big-ufo'
)
  .requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
  .defines(function() {
    EntityBigUFO = GenericEntity.extend({
      size: {x:256, y:256},
      animSheet: new ig.AnimationSheet( 'media/UFO-Big.png', 256, 256 )
    });
    ig.EntityPool.enableFor( EntityBigUFO );
  });