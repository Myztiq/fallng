ig.module(
  'game.entities.stars'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntityStars = GenericEntity.extend({
    checkAgainst: ig.Entity.TYPE.D,
    size: {x:32, y:32},
    animSheet: new ig.AnimationSheet( 'media/Stars.png', 32, 32 ),

    init: function(x, y, settings) {
      this.addAnim( 'idle', 1, [Math.floor(Math.random()*2)] );
      this.parent(x, y, settings);
    }
  });
  ig.EntityPool.enableFor( EntityStars );
});