ig.module(
  'game.entities.generic-entity'
)
  .requires(
  'impact.entity',
  'game.entities.particle',
  'impact.entity-pool'
)
  .defines(function() {
    GenericEntity = ig.Entity.extend({
      size: {x:256, y:256},
      animSheet: new ig.AnimationSheet( 'media/UFO-Big.png', 256, 256 ),
      checkAgainst: ig.Entity.TYPE.A,
      maxVel: {
        x: 10000,
        y: 10000
      },

      init: function(x, y, settings) {
        this.parent(x, y, settings);
        if(!this.anims.idle){
          this.addAnim( 'idle', 1, [0] );
        }
        if(settings.rotate){
          this.anims.idle.angle = settings.rotate;
        }
      },

      check: function(other) {
        other.bounce(this);
        var self = this;
        self.flash = true;

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
      },
      update: function() {
        this.parent();
        if(this.flash){
          this.anims.idle.alpha = Math.random();

          for(var i=0;i<Math.random()*2;i++){
            var size = Math.floor(Math.random() * 10) + 1;
            ig.game.spawnEntity(BlueFireGib, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, {size: {x: size, y: size}});
          }

        }else{
          this.anims.idle.alpha = 1;
        }
        if(ig.game.player.pos.y - this.pos.y > 1000){
          this.kill();
        }
      }
    });
  });