ig.module(
  'game.entities.space-mine'
)
  .requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
  .defines(function() {
    EntitySpaceMine = GenericEntity.extend({
      size: {x:32, y:32},
      animSheet: new ig.AnimationSheet( 'media/Space-Mine.png', 32, 32 )
    });
    ig.EntityPool.enableFor( EntitySpaceMine );
  });