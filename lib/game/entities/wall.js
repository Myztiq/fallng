ig.module(
  'game.entities.wall'
)
.requires(
  'impact.entity',
  'impact.entity-pool'
)
.defines(function() {
  EntityWall = ig.Entity.extend({
    size: {x:32, y:32},
    animSheet: new ig.AnimationSheet( 'media/tileset_ground.png', 32, 32 ),
    checkAgainst: ig.Entity.TYPE.A,
    name: "wall", //Name portals in the editor: use portal.[color]

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim( 'idle', 1, [0] );
    },

    check: function(other) {
      other.bounce();
      this.kill();
    },
    update: function() {
      this.parent();
      if(ig.game.player.pos.y - this.pos.y > 1000){
        this.kill();
      }
    }
  });
  ig.EntityPool.enableFor( EntityWall );
});