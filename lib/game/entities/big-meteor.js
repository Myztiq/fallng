ig.module(
  'game.entities.big-meteor'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntityBigMeteor = GenericEntity.extend({
    size: {x:64, y:64},
    animSheet: new ig.AnimationSheet( 'media/Meteors-64.png', 64, 64 )
  });
  ig.EntityPool.enableFor( EntityBigMeteor );
});