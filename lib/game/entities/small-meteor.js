ig.module(
  'game.entities.small-meteor'
)
.requires(
  'impact.entity',
  'impact.entity-pool'
)
.defines(function() {
  EntitySmallMeteor = ig.Entity.extend({
    size: {x:32, y:32},
    animSheet: new ig.AnimationSheet( 'media/Meteors-32.png', 32, 32 ),
    checkAgainst: ig.Entity.TYPE.A,
    name: "meteor", //Name portals in the editor: use portal.[color]

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim( 'idle', 1, [Math.floor(Math.random()*4)] );
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