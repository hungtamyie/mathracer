class GameHandler {
    constructor (){
        this.game = new Game({"mapName": "beginner", "racers": {"racerA": new Racer()}});
        this.renderer = new Renderer({"mapName": "beginner"});
        this.inputHandler = new InputHandler();
    }
    
    tick(){
        this.renderer.render(this.game);
        this.renderer.updateCamera(this.game.racers.racerA);
        //this.game.racers.racerA.dir.setDirection(this.game.racers.racerA.dir.getDirection() + 0.03);
        this.inputHandler.getInputs(this.game.racers.racerA)
        this.game.updateState(1);
        //this.renderer.camera.zoom += 0.0001;
        //this.renderer.camera.x += 1;
        //this.renderer.camera.y += 1;
        window.requestAnimationFrame(this.tick.bind(this));
    }
}

class Renderer {
    constructor (args){
        this.camera = {
            x: 300,
            y: 200,
            zoom: 1,
        }
        this.mapName = args.mapName;
    }
    
    updateCamera(racer){
        
        let offsetX = this.camera.x - racer.pos.x;
        let offsetY = this.camera.y - racer.pos.y/2;
        
        let forwardVector = racer.vel.copy();
        forwardVector.multiplyBy(SETTINGS.CAMERA.distance_forwards);
        //offsetX -= forwardVector.x;
        //offsetY -= forwardVector.y;
            
        this.camera.x -= offsetX/SETTINGS.CAMERA.stiffness;
        this.camera.y -= offsetY/SETTINGS.CAMERA.stiffness;
    }
    
    render (predictedGameState){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        this.renderMap();
        this.renderObstacles(predictedGameState);
        this.renderRacers(predictedGameState);
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
    
    renderObstacles(predictedGameState){
        let obstacles = predictedGameState.mapEntities;
    }
    
    renderRacers(predictedGameState){
        let racers = predictedGameState.racers;
        ctx.globalAlpha = 1;
        for (const property in racers) {
            let racer = racers[property];
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
                let dy = racer.pos.y - RACER_DRAW_SIZE[1]/2 - RACER_STACK_HEIGHT*i*2;
                let dw = RACER_DRAW_SIZE[0];
                let dh = RACER_DRAW_SIZE[1];
                
                let matrixedOutput = this.cameraMatrix(dx, dy, dw, dh);
                dx = matrixedOutput[0];
                dy = matrixedOutput[1];
                dw = matrixedOutput[2];
                dh = matrixedOutput[3];
                
                let cx = racer.pos.x;
                let cy = racer.pos.y + RACER_ROTATION_OFFSET;
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
        ctx.globalAlpha = 1;
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
        }
        
        document.onkeyup = function(e){
            let key = e.key.toLowerCase();
            self.keys[key] = false;
        }
        
        document.onmousedown = function(e){
            let realXY = gameHandler.renderer.reverseCameraMatrix(e.screenX,e.screenY);
            gameHandler.game.racers.racerA.pos.x = realXY[0];
            gameHandler.game.racers.racerA.pos.y = realXY[1]; 
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