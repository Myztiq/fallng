ig.module(
  'game.entities.small-meteor'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntitySmallMeteor = GenericEntity.extend({
    size: {x:32, y:32},
    animSheet: new ig.AnimationSheet( 'media/Meteors-32.png', 32, 32 )
  });
  ig.EntityPool.enableFor( EntitySmallMeteor );
});