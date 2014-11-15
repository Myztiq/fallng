ig.module(
  'game.entities.airplane'
)
.requires(
  'game.entities.generic-entity',
  'impact.entity-pool'
)
.defines(function() {
  EntityAirplane = GenericEntity.extend({
    size: {x:248, y:90},
    offset: {x: 4, y: 100},
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
    },
    check: function(other) {
      other.bounce(this);
      var self = this;
      self.flash = true;

      console.log("inAirplane check");
      this.checkAgainst = ig.Entity.TYPE.D;
      var angle = this.angleTo(other);
      var x = Math.cos(angle);
      var y = Math.sin(angle);
      var hitVel = 1000;
      this.vel.x = -x * hitVel;
      this.vel.y = -y * hitVel;

      setTimeout(function(){
        self.flash = false;
      }, 600)
    }

  });
  ig.EntityPool.enableFor( EntityAirplane );
});