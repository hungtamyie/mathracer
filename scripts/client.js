class GameHandler {
    constructor (){
        this.game = new Game({"mapName": "beginner", "racers": {"racerA": new Racer(937, 1476, -1, -1)}});
        this.renderer = new Renderer({"mapName": "beginner"});
        this.myRacer = "A";
        this.inputHandler = new InputHandler();
        this.lastTick = new Date();
        
        //TEMPORARY
        this.lastFinish = new Date();
        this.recentFinishTime = 0;
        this.bestFinishTime = 1000000;
        this.justStarted = true;
    }
    
    tick(){
        let currentTick = new Date();
        let tickDifference = currentTick.getTime() - this.lastTick.getTime();
        if (tickDifference > 1000/SETTINGS.GRAPHICS.fps) {
            let delta = tickDifference/ (1000/144);
            
            this.lastTick = currentTick;
            this.renderer.render(this.game);
            this.renderer.updateCamera(this.game.racers["racer" + this.myRacer], delta);
            this.inputHandler.getInputs(this.game.racers["racer" + this.myRacer]);
            this.game.updateState(delta);
        }
        window.requestAnimationFrame(this.tick.bind(this));
    }
    
    handleFinishTEMPORARYTEMPORARY(){
        let start = this.renderer.cameraMatrix(762,1450);
        let end = this.renderer.cameraMatrix(892,1318);
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        
        let circle = {
            x: this.game.racers.racerA.pos.x,
            y: this.game.racers.racerA.pos.y,
            radius: this.game.racers.racerA.stats.radius,
        }
        let line = {
            p1: {x: 762, y: 1450},
            p2: {x: 892, y: 1318}
        }
        let currentTick = new Date();
        if (collisionCircleLine(circle, line) && Math.sqrt(Math.pow(circle.x - 800, 2) + Math.pow(circle.y - 1360, 2)) < 150) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'red';
            ctx.stroke();
        
            if (currentTick.getTime() - this.lastFinish.getTime() > 5000 || this.justStarted) {
                this.recentFinishTime = currentTick.getTime() - this.lastFinish.getTime();
                //this.bestFinishTime =
                if (this.recentFinishTime < this.bestFinishTime && this.justStarted == false) {
                    this.bestFinishTime = this.recentFinishTime;
                }
                this.justStarted = false;
                this.lastFinish = new Date();
            }
        }
        else {
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
        
        let runningTime = currentTick.getTime() - this.lastFinish.getTime();
        
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Recent Finish " + msToTime(this.recentFinishTime), 100, 130);
        ctx.fillText("Fastest Finish " + msToTime(this.bestFinishTime), 100, 100);
        ctx.font = "30px Arial";
        ctx.fillStyle = "blue"; 
        ctx.fillText(msToTime(runningTime), 100, 180);
        
        function msToTime(s) {
        
          // Pad to 2 or 3 digits, default is 2
          function pad(n, z) {
            z = z || 2;
            return ('00' + n).slice(-z);
          }
        
          var ms = s % 1000;
          s = (s - ms) / 1000;
          var secs = s % 60;
          s = (s - secs) / 60;
          var mins = s % 60;
          var hrs = (s - mins) / 60;
        
          return pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
        }
        function collisionCircleLine(circle,line){ // Both are objects
                
            var side1 = Math.sqrt(Math.pow(circle.x - line.p1.x,2) + Math.pow(circle.y - line.p1.y,2)); // Thats the pythagoras theoram If I can spell it right
        
            var side2 = Math.sqrt(Math.pow(circle.x - line.p2.x,2) + Math.pow(circle.y - line.p2.y,2));
        
            var base = Math.sqrt(Math.pow(line.p2.x - line.p1.x,2) + Math.pow(line.p2.y - line.p1.y,2));
        
            if(circle.radius > side1 || circle.radius > side2)
                return true;
        
            var angle1 = Math.atan2( line.p2.x - line.p1.x, line.p2.y - line.p1.y ) - Math.atan2( circle.x - line.p1.x, circle.y - line.p1.y ); // Some complicated Math
        
            var angle2 = Math.atan2( line.p1.x - line.p2.x, line.p1.y - line.p2.y ) - Math.atan2( circle.x - line.p2.x, circle.y - line.p2.y ); // Some complicated Math again
        
            if(angle1 > Math.PI / 2 || angle2 > Math.PI / 2) // Making sure if any angle is an obtuse one and Math.PI / 2 = 90 deg
                return false;
        
        
                // Now if none are true then
        
                var semiperimeter = (side1 + side2 + base) / 2;
        
                var areaOfTriangle = Math.sqrt( semiperimeter * (semiperimeter - side1) * (semiperimeter - side2) * (semiperimeter - base) ); // Heron's formula for the area
        
                var height = 2*areaOfTriangle/base;
        
                if( height < circle.radius )
                    return true;
                else
                    return false;
        
        }
    }
}

class Renderer {
    constructor (args){
        this.camera = {
            x: 600,
            y: 500,
            zoom: 1.1,
        }
        this.drawBuffer = [];
        this.mapName = args.mapName;
    }
    
    updateCamera(racer, delta){
        
        let offsetX = this.camera.x - racer.pos.x;
        let offsetY = this.camera.y - racer.pos.y/2;
            
        this.camera.x -= (offsetX/SETTINGS.CAMERA.stiffness) * delta;
        this.camera.y -= (offsetY/SETTINGS.CAMERA.stiffness) * delta;
        
        let percentageSpeed = 1-(racer.vel.getMagnitude()/racer.stats.topSpeed);
        let idealZoom = SETTINGS.CAMERA.minzoom + (SETTINGS.CAMERA.maxzoom - SETTINGS.CAMERA.minzoom)*percentageSpeed;
        this.camera.zoom -= ((this.camera.zoom - idealZoom)/SETTINGS.CAMERA.zoomStiffness) * delta;
    }
    
    render (predictedGameState){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        this.renderMap();
        gameHandler.handleFinishTEMPORARYTEMPORARY();
        this.drawBuffer = [];
        this.addObstaclesToBuffer(predictedGameState);
        this.addRacersToBuffer(predictedGameState);
        this.sortBuffer();
        this.renderBuffer();
        this.drawParticles(predictedGameState);
    }
    
    renderMap (){
        let map = MAPS[this.mapName];
        
        for (let x = -2; x < 11; x++) {
            for (let y = -2; y < 7; y++) {
                let out = this.cameraMatrix(x*BACKGROUND_SHEET_SIZE, y*BACKGROUND_SHEET_SIZE*2, BACKGROUND_SHEET_SIZE, BACKGROUND_SHEET_SIZE);
                ctx.drawImage(images[map.backgroundImage], out[0], out[1], out[2], out[3]);
            }
        }
        
        let sx = 0;
        let sy = 0;
        let sw = map.width;
        let sh = map.height;

        let dx = 0;
        let dy = 0;
        let dw = map.width * map.drawScale;
        let dh = map.height * map.drawScale;
        
        let matrixedOutput = this.cameraMatrix(dx, dy, dw, dh);
        dx = matrixedOutput[0];
        dy = matrixedOutput[1];
        dw = matrixedOutput[2];
        dh = matrixedOutput[3];
        
        ctx.drawImage(images[map.image], sx, sy, sw, sh, dx, dy, dw, dh);
    }
    
    addObstaclesToBuffer(predictedGameState){
        let obstacles = predictedGameState.mapEntities;
        for (let i = 0; i < obstacles.length; i++) {
            let obstacle = obstacles[i];
            this.drawBuffer.push(obstacle);
        }
    }
    
    renderObstacle(obstacle){
        let image = images["obstacleSheet"];
        let shakeAmount = obstacle.shake * obstacle.shakeCounter * obstacle.shakeScale;
        let sx = obstacle.sX;
        let sy = obstacle.sY;
        let sw = obstacle.sW;
        let sh = obstacle.sH;
        let dx = obstacle.x - obstacle.dW/2 - shakeAmount/2;
        let dy = obstacle.y - obstacle.dH/2 + obstacle.dO + shakeAmount;
        let dh = obstacle.dH + shakeAmount;
        let dw = obstacle.dW - shakeAmount;
        let matrixedOutput = this.cameraMatrix(dx, dy, dw, dh);
        dx = matrixedOutput[0];
        dy = matrixedOutput[1];
        dw = matrixedOutput[2];
        dh = matrixedOutput[3];
        ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dh, dw);
    }
    
    addRacersToBuffer(predictedGameState){
        let racers = predictedGameState.racers;
        for (const property in racers) {
            let racer = racers[property];
            this.drawBuffer.push(racer);
        }
    }
    
    drawRacer(racer){
        let racerImage = images.car3dnew;
        for(let i=0; i<15; i++) {
            
            //Figure out which sprite to take from sprite sheet
            let z = 0;
            if (i > 0 && i < 6) {
                if (racer.inputs.turning == -1) {
                    z=1;
                }
                if (racer.inputs.turning == 1) {
                    z=2;
                }
            }
            let sx = RACER_SIZE[0] * i;
            let sy = RACER_SIZE[1] * z;
            let sw = RACER_SIZE[0];
            let sh = RACER_SIZE[1];
            
            //Figure out where on the canvas the sprite will be drawn
            //why are we multiplying by 2 here??? i have no idea. I spent 2 hours just messing with numbers and this worked for some reason. 
            let dx = racer.pos.x - RACER_DRAW_SIZE[0]/2;
            let dy = racer.pos.y - RACER_DRAW_SIZE[1]/2 - RACER_STACK_HEIGHT*i*2 + RACER_DRAW_OFFSET;
            let dw = RACER_DRAW_SIZE[0];
            let dh = RACER_DRAW_SIZE[1];
            
            let matrixedOutput = this.cameraMatrix(dx, dy, dw, dh);
            dx = matrixedOutput[0];
            dy = matrixedOutput[1];
            dw = matrixedOutput[2];
            dh = matrixedOutput[3];
            
            let cx = racer.pos.x;
            let cy = racer.pos.y + RACER_ROTATION_OFFSET + RACER_DRAW_OFFSET;
            let hc = RACER_STACK_HEIGHT*i;
            let matrixedTruePos = this.cameraMatrix(cx, cy, hc);
            cx = matrixedTruePos[0];
            cy = matrixedTruePos[1];
            hc = matrixedTruePos[2];
            
            //Make transformations to canvas then draw racer
            let angle = racer.dir.getDirection() + 90 * Math.PI/180;
            ctx.translate(cx, cy - hc);
            ctx.scale(1, 0.5);
            ctx.rotate(angle);
            ctx.translate(-cx, -cy + hc);
            
            ctx.drawImage(racerImage, sx, sy, sw, sh, dx, dy, dw, dh);
            ctx.setTransform(1, 0, 0, 1, 0, 0,); //undo canvas rotation
        }
    }
    
    drawRacerNew(racer){
        let racerImage = images.car3dnew;
        racerCtx.clearRect(0,0,racerCanvas.width,racerCanvas.height);
        for(let i=0; i<15; i++) {
            //Figure out which sprite to take from sprite sheet
            let z = 0;
            if (i > 0 && i < 6) {
                if (racer.inputs.turning == -1) {
                    z=1;
                }
                if (racer.inputs.turning == 1) {
                    z=2;
                }
            }
            let sx = RACER_SIZE[0] * i;
            let sy = RACER_SIZE[1] * z;
            let sw = RACER_SIZE[0];
            let sh = RACER_SIZE[1];
            
            //Figure out where on the canvas the sprite will be drawn
            //why are we multiplying by 2 here??? i have no idea. I spent 2 hours just messing with numbers and this worked for some reason. 
            let dx = 0;
            let dy = 0 - RACER_STACK_HEIGHT*i;
            let dw = RACER_SIZE[0];
            let dh = RACER_SIZE[1];
            
            let cx = RACER_SIZE[0]/2;
            let cy = RACER_SIZE[1]/2;
            let hc = RACER_STACK_HEIGHT*i;
            
            //Make transformations to canvas then draw racer
            let angle = racer.dir.getDirection() + 90 * Math.PI/180;
            racerCtx.translate(cx, cy - hc);
            racerCtx.scale(1, 0.5);
            racerCtx.rotate(angle);
            racerCtx.translate(-cx, -cy + hc);
            
            racerCtx.drawImage(racerImage, sx, sy, sw, sh, dx, dy, dw, dh);
            racerCtx.setTransform(1, 0, 0, 1, 0, 0,); //undo canvas rotation
        }
        
        let dx = racer.pos.x - RACER_DRAW_SIZE[0]/2;
        let dy = racer.pos.y - RACER_DRAW_SIZE[1]/2 + RACER_DRAW_OFFSET;
        let dw = RACER_DRAW_SIZE[0];
        let dh = RACER_DRAW_SIZE[1];
        
        let matrixedOutput = this.cameraMatrix(dx, dy, dw, dh);
        dx = matrixedOutput[0];
        dy = matrixedOutput[1];
        dw = matrixedOutput[2];
        dh = matrixedOutput[3];
        ctx.globalAlpha = 1;
        ctx.drawImage(racerCanvas, 0, 0, RACER_SIZE[0], RACER_SIZE[1], dx, dy, dw, dh);
        ctx.globalAlpha = 1;
    }
    
    sortBuffer(){
        function quicksort(array) {
            if (array.length <= 1) {
              return array;
            }
          
            var pivot = array[0];
            
            var left = []; 
            var right = [];
          
            for (var i = 1; i < array.length; i++) {
              array[i].getY() < pivot.getY() ? left.push(array[i]) : right.push(array[i]);
            }
          
            return quicksort(left).concat(pivot, quicksort(right));
        };
        this.drawBuffer = quicksort(this.drawBuffer);
    }
    
    renderBuffer(){
        for (let i = 0; i < this.drawBuffer.length; i++) {
            let obj = this.drawBuffer[i];
            if(obj.constructor.name == "Racer"){
                this.drawRacerNew(obj);
            }
            else{
                this.renderObstacle(obj);
            }
        }
    }
    
    drawParticles(predictedGameState){
        let img = images.particleSheet;
        for (let i = 0; i < predictedGameState.particles.length; i++) {
            let particle =  predictedGameState.particles[i];
            
            let sx = particle.sW * particle.sX + particle.sW * particle.drawIndex;
            let sy = particle.sH * particle.sY;
            let sw = particle.sW;
            let sh = particle.sH;
    
            let dx = particle.x - particle.drawSize/2;
            let dy = particle.y + particle.drawOffset - particle.drawSize/2;
            let dw = particle.drawSize;
            let dh = particle.drawSize;
            
            let matrixedOutput = this.cameraMatrix(dx, dy, dw, dh);
            dx = matrixedOutput[0];
            dy = matrixedOutput[1];
            dw = matrixedOutput[2];
            dh = matrixedOutput[3];
            
            ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
        }
    }
    
    //Takes a position where a sprite will be drawn and changes it based on where the camera is
    cameraMatrix(x,y,w,h,dontScale){
        let nx = ((x - this.camera.x) * this.camera.zoom) * S + canvas.width/2;
        let ny = ((y/2 - this.camera.y) * this.camera.zoom) * S + canvas.height/2;
        let nw = (w * this.camera.zoom) * S;
        let nh = (h * this.camera.zoom) * S;
        return [nx,ny,nw,nh];
    }

    //Takes an pixel from the screen and figures out where the real x and y coordinates are
    reverseCameraMatrix(x,y){
        let nx = (((x - canvas.width/2)/S)/this.camera.zoom)+this.camera.x;
        let ny = ((((y - canvas.height/2)/S)/this.camera.zoom)+this.camera.y)*2;
        
        return [nx, ny];
    }
}

class InputHandler { 
    constructor (){
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            shift: false,
        };
        
        let self = this;
        document.onkeydown = function(e){
            let key = e.key.toLowerCase();
            self.keys[key] = true;
            
            
            
            
            //TO BE DELETED LATER
            if (key == "i") {
                gameHandler.renderer.camera.y -= 100;
            }
            if (key == "j") {
                gameHandler.renderer.camera.x -= 100;
            }
            if (key == "k") {
                gameHandler.renderer.camera.y += 100;
            }
            if (key == "l") {
                gameHandler.renderer.camera.x += 100;
            }
        }
        
        document.onkeyup = function(e){
            let key = e.key.toLowerCase();
            self.keys[key] = false;
        }
        
        document.onmousedown = function(e){
            let realXY = gameHandler.renderer.reverseCameraMatrix(e.screenX,e.screenY);
            changing = false;
        }
        
        document.onmousemove = function(e){
            if (changing) {
                let realXY = gameHandler.renderer.reverseCameraMatrix(e.screenX,e.screenY);
                let entity = gameHandler.game.mapEntities[gameHandler.game.mapEntities.length-1];
                entity.x = realXY[0].toFixed(1)*1;
                entity.y = realXY[1].toFixed(1)*1;
                MAPS.beginner.entities[MAPS.beginner.entities.length-1][1] = realXY[0].toFixed(1)*1;
                MAPS.beginner.entities[MAPS.beginner.entities.length-1][2] = realXY[1].toFixed(1)*1;
            }
        }
    }
    
    getInputs(racer){
        if (this.keys[SETTINGS.BINDS.Turn_left] && !this.keys[SETTINGS.BINDS.Turn_right]) {
            racer.inputs.turning = -1;
        }
        else if (this.keys[SETTINGS.BINDS.Turn_right] && !this.keys[SETTINGS.BINDS.Turn_left]) {
            racer.inputs.turning = 1;
        }
        else {
            racer.inputs.turning = 0;
        }
        
        if (this.keys[SETTINGS.BINDS.Drive_forwards]) {
            racer.inputs.accelerating = 1;
        }
        else if (this.keys[SETTINGS.BINDS.Drive_backwards]) {
            racer.inputs.accelerating = -1;
        }
        else {
            racer.inputs.accelerating = 0;
        }
    }
}