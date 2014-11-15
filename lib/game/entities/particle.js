ig.module(
  'game.entities.particle'
).requires(
  'impact.entity'
).defines(function(){

    EntityParticle = ig.Entity.extend({
      // single pixel sprites
      size: { x:1, y:1 },

      // particle will collide but not effect other entities
      type: ig.Entity.TYPE.NONE,
      checkAgainst: ig.Entity.TYPE.NONE,
      collides: ig.Entity.COLLIDES.LITE,

      // default particle lifetime & fadetime
      lifetime: 5,
      fadetime: 1,
      alpha: 255,

      // particles will bounce off other entities when it collides
      minBounceVelocity: 0,
      bounciness: 1.0,
      friction: { x:0, y:0 },

      init:function( x, y, settings ){
        this.parent( x, y, settings );

        // take velocity and add randomness to vel
        var vx = this.vel.x;
        var vy = this.vel.y;
        this.vel.x = (Math.random()*2-1)*vx;
        this.vel.y = (Math.random()*2-1)*vy;

        // init timer for fadetime
        this.idleTimer = new ig.Timer();
        this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
      },

      update: function() {
        // check if particle has exsisted past lifetime
        // if so, remove particle
        if(this.idleTimer.delta() > this.lifetime){
          this.kill();
          return;
        }

        // fade the particle effect using the aplha blend
        this.alpha = this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime, 1, 0 );

        this.parent();
      },

      draw: function() {
        var ctx = ig.system.context;
        var s = ig.system.scale;
        var x = this.pos.x * s - ig.game.screen.x * s;
        var y = this.pos.y * s - ig.game.screen.y * s;
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.size.x/2, this.size.y/2);

        ctx.restore();
      }

    });

    BlueFireGib = EntityParticle.extend({
      // shorter lifetime
      lifetime: 1,
      fadetime: 1,
      size: { x:5, y:5 },
      maxVel:{
        x: 99999,
        y: 99999
      },

      // velocity value to be set
      vel: null,

      gravityFactor: 0,

      // bounce a little less
      bounciness: 0.6,

      init:function( x, y, settings ){
        var velocity = 1000;
        // update random velocity to create starburst effect
        this.vel = {
          x: Math.random() * velocity - velocity / 2,
          y: Math.random() * velocity - velocity / 2
        };

        // send to parent
        this.parent( x, y, settings );
      }
    });

  });