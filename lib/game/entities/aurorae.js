ig.module(
  'game.entities.aurorae'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntityAurorae = GenericEntity.extend({
    checkAgainst: ig.Entity.TYPE.D,
    size: {x:800, y:800},
    animSheet: new ig.AnimationSheet( 'media/Aurorae.png', 800, 800 ),

    init: function(x, y, settings) {
      this.addAnim( 'idle', 1, [Math.floor(Math.random()*2)] );
      this.parent(x, y, settings);
    },
    update: function() {
      this.parent();
      this.pos.x = 0;
    }
  });
  ig.EntityPool.enableFor( EntityAurorae );
});