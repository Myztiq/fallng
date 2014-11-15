ig.module(
  'game.entities.small-ufo'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntitySmallUFO = GenericEntity.extend({
    size: {x:128, y:128},
    animSheet: new ig.AnimationSheet( 'media/UFO-Small.png', 128, 128 )
  });
  ig.EntityPool.enableFor( EntitySmallUFO );
});