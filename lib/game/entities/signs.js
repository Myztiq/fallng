ig.module(
  'game.entities.signs'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntitySigns = GenericEntity.extend({
    size: {x:256, y:256},
    animSheet: new ig.AnimationSheet( 'media/Signs.png', 256, 256 ),
    init: function(x, y, settings) {
      var leftSign = Math.random() > .5;
      this.isLeftSign = leftSign;
      if(leftSign){
        this.pos.x = -10;
        this.addAnim( 'idle', 1, [0] );
      }else{
        this.pos.x = 810;
        this.addAnim( 'idle', 1, [1] );
      }

      this.parent(x, y, settings);
      if(settings.rotate){
        this.anims.idle.angle = settings.rotate;
      }
    },
    update: function() {
      this.parent();
      if(this.isLeftSign){
        this.pos.x = -10;
      }else{
        this.pos.x = 810;
      }
    }
  });
  ig.EntityPool.enableFor( EntitySigns );
});