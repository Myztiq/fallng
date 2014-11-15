# Down with Drones
## A top down puzzle game.

To get started
- Get http://impactjs.com/ 
- Add the impact library and weltmeister editor folders to /lib
- run: python server.py
- game is running at http://localhost:8080/
- editor is running at http://localhost:8080/editor


To deploy
- php tools/bake.php lib/impact/impact.js lib/game/main.js game.min.js
- divshot deploy production