ig.module(
  'game.entities.generic-entity'
)
  .requires(
  'impact.entity',
  'impact.entity-pool'
)
  .defines(function() {
    GenericEntity = ig.Entity.extend({
      size: {x:256, y:256},
      animSheet: new ig.AnimationSheet( 'media/UFO-Big.png', 256, 256 ),
      checkAgainst: ig.Entity.TYPE.A,

      init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.addAnim( 'idle', 1, [0] );
        if(settings.rotate){
          this.anims.idle.angle = settings.rotate;
        }
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
  });