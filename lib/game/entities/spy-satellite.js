ig.module(
  'game.entities.spy-satellite'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntitySpySatellite = GenericEntity.extend({
    size: {x:96, y:96},
    animSheet: new ig.AnimationSheet( 'media/Spy-Satellite.png', 96, 96 )
  });
  ig.EntityPool.enableFor( EntitySpySatellite );
});