ig.module(
  'game.entities.cloud'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntityCloud = GenericEntity.extend({
    zIndex: -10,
    checkAgainst: ig.Entity.TYPE.D,
    size: {x:800, y:800},
    animSheet: new ig.AnimationSheet( 'media/Cloud.png', 800, 800 ),

    init: function(x, y, settings) {
      this.addAnim( 'idle', 1, [Math.floor(Math.random()*6)] );
      this.parent(x, y, settings);
      this.alpha = .2 + Math.random() / 5;
    },
    update: function() {
      this.parent();
      this.anims.idle.alpha = this.alpha;
      this.pos.x = 0;
    }
  });
  ig.EntityPool.enableFor( EntityCloud );
});