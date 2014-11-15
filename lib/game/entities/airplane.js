ig.module(
  'game.entities.airplane'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntityAirplane = GenericEntity.extend({
    size: {x:256, y:256},
    maxVel: {
      x: 4000,
      y: 4000
    },
    animSheet: new ig.AnimationSheet( 'media/Airplane.png', 256, 256 ),
    init: function(x, y, settings) {
      this.velX = Math.random()*50 - 300;
      settings.vel.x = this.velX;
      this.parent(x, y, settings);
    },
    update: function() {
      if(!this.flash){
        this.vel.x = this.velX;
      }
      this.parent()
    }
  });
  ig.EntityPool.enableFor( EntityAirplane );
});