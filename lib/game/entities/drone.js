ig.module(
  'game.entities.drone'
)
  .requires(
  'impact.entity'
)
.defines(function(){

  EntityDrone = ig.Entity.extend({
    size: {x:16, y:16},
    collides: ig.Entity.COLLIDES.ACTIVE,

    speed: 200,
    meanderSpeed: 40,
    prevVel: {
      x: 0,
      y: 0
    },
    maxVel: {
      x: 400,
      y: 400
    },
    name: 'drone', //Name drones in the editor: use drone.[color]
    type: ig.Entity.TYPE.A,

    prevX: 0,
    prevY: 0,
    isMeander: false,

    animSheet: new ig.AnimationSheet( 'media/zombie.png', 16, 16 ),

    init: function( x, y, settings ) {
      this.parent( x, y, settings );


      this.noMoveTimer = {
        x: new ig.Timer(),
        y: new ig.Timer()
      }
      if(this.name === "drone.red") {
        this.animSheet = new ig.AnimationSheet( 'media/zombiePink.png', 16, 16 );
      }

      var rand_num = Math.floor((Math.random()*100)/25);
      var run_frame_arr = [0,1,2,1,0,3,4,3];

      for(var i = rand_num; i >= 0; i = i - 1){
        run_frame_arr.unshift(run_frame_arr.pop());
      };

      this.addAnim( 'idle', 1, [rand_num] );
      this.addAnim( 'run', 0.07, run_frame_arr );
    },

    update: function() {
      var self = this;

      if( ig.input.state('up') ) {
        this.isMeander = false;
        this.vel.y = -this.speed;
      } else if( ig.input.state('down') ) {
        this.isMeander = false;
        this.vel.y = this.speed;
      } else{
        this.vel.y = 0;
      }


      if( ig.input.state('left') ) {
        this.noMoveTimer.x.set(-1);
        this.vel.x = -this.speed;
      } else if( ig.input.state('right') ) {
        this.noMoveTimer.x.set(-1);
        this.vel.x = this.speed;
      } else {
        this.vel.x = 0;
      }


      if( ig.input.state('cluster') || ig.input.state('decluster') ) {
        var center = {
          pos: ig.game.averageDroneCenter,
          size: this.size
        };
        if(ig.input.state('decluster')){
          this.moveRelativeTo(center, -1);
        }else{
          this.moveRelativeTo(center, 1);
        }

      }

      if(this.vel.x == 0 && this.vel.y == 0){
        this.currentAnim = this.anims.idle;

        if(this.meandering){
          this.vel.x = this.prevVel.x;
          this.vel.y = this.prevVel.y;
          if(this.noMoveTimer.x.delta() > 0){
            this.noMoveTimer.x.set(Math.random());
            this.vel.x = Math.random() * this.meanderSpeed - this.meanderSpeed / 2;
          }
          if(this.noMoveTimer.y.delta() > 0){
            this.noMoveTimer.y.set(Math.random());
            this.vel.y = Math.random() * this.meanderSpeed - this.meanderSpeed / 2;
          }
        }else{
          this.meandering = true;
          this.noMoveTimer.y.set(Math.random() * 5);
          this.noMoveTimer.x.set(Math.random() * 5);
          this.vel.x = 0;
          this.vel.y = 0;
        }
      }else{
        this.meandering = false;
        this.currentAnim = this.anims.run;
      }


      if(this.vel.x === 0 && this.vel.y === 0){
        var movementAngle = Math.atan2(this.prevX, this.prevY)+Math.PI;
      }else{
        var movementAngle = Math.atan2(-this.vel.x,this.vel.y)+Math.PI;
        this.prevX = -this.vel.x;
        this.prevY = this.vel.y;
      }

      this.anims.run.angle = movementAngle;
      this.anims.idle.angle = movementAngle;

      this.prevVel.x = this.vel.x;
      this.prevVel.y = this.vel.y;
      this.parent();
    },
    moveRelativeTo: function(entity, direction){
      var angle = this.angleTo(entity);
      var x = Math.cos(angle);
      var y = Math.sin(angle);

      if(direction == 1){
        if(this.distanceTo(entity) < 20){
          var danceSpeed = this.speed / 2;
          this.vel.x = Math.random() * danceSpeed - danceSpeed / 2;
          this.vel.y = Math.random() * danceSpeed - danceSpeed / 2;
          return;
        }
      }

      this.vel.x = x * this.speed * direction;
      this.vel.y = y * this.speed * direction;

    },

    handleMovementTrace: function(res) {
      var pos = res.pos;
      var edge = ig.game.backgroundMaps[1];

      var distance = function(xd,yd) {
        return Math.sqrt( xd*xd + yd*yd );
      }

      var checkTile = function(x,y) {
        var checkDistance = false;
        if(x < 0 || y < 0) {
          checkDistance = true;
        } else if(y > edge.data.length || x > edge.data[0].length) {
          checkDistance = true;
        } else if (edge.data[y][x] > 0) {
          // console.log("data edge", edge.data[x][y]);
          checkDistance = true;
        }

        if(checkDistance) {
          if(pos.x < 9 || pos.x > 951) {
            return true;
          } else if(pos.y < 9 || pos.y > 487) {
            return true;
          } else if(distance((x*16 - pos.x),(y*16 - pos.y)) < 9) {
            return true;
          }else {
            return false;
          }
        } else {
          return false;
        }
      };
      var tileX = Math.floor(pos.x/16);
      var tileY = Math.floor(pos.y/16);
      if(checkTile(tileX, tileY)
        || checkTile(tileX+1, tileY)
        || checkTile(tileX, tileY+1)
        || checkTile(tileX+1, tileY+1)){
        console.log('Killing drone');
        this.kill();
      }
      this.parent(res);
    }
  });
});
