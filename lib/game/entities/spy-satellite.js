ig.module(
  'game.entities.spy-satellite'
)
.requires(
  'impact.entity',
  'impact.entity-pool'
)
.defines(function() {
  EntitySpySatellite = ig.Entity.extend({
    size: {x:96, y:96},
    animSheet: new ig.AnimationSheet( 'media/Spy-Satellite.png', 96, 96 ),
    checkAgainst: ig.Entity.TYPE.A,
    name: "meteor", //Name portals in the editor: use portal.[color]

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