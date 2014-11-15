ig.module(
  'game.entities.big-meteor'
)
.requires(
  'impact.entity',
  'impact.entity-pool'
)
.defines(function() {
  EntityBigMeteor = ig.Entity.extend({
    size: {x:64, y:64},
    animSheet: new ig.AnimationSheet( 'media/Meteors-64.png', 64, 64 ),
    checkAgainst: ig.Entity.TYPE.A,
    name: "meteor", //Name portals in the editor: use portal.[color]

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim( 'idle', 1, [Math.floor(Math.random()*3)] );
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