class GameHandler {
    constructor (){
        this.game = new Game({"mapName": "beginner", "racers": {"racerA": new Racer()}});
        this.renderer = new Renderer({"mapName": "beginner"});
        this.inputHandler = new InputHandler();
    }
    
    tick(){
        this.renderer.render(this.game);
        //this.game.racers.racerA.dir.setDirection(this.game.racers.racerA.dir.getDirection() + 0.03);
        this.inputHandler.getInputs(this.game.racers.racerA)
        this.game.updateState(1);
        //this.renderer.camera.zoom += 0.001;
        window.requestAnimationFrame(this.tick.bind(this));
    }
}

class Renderer {
    constructor (args){
        this.camera = {
            x: 0,
            y: 500,
            zoom: 0.6,
        }
        this.mapName = args.mapName;
    }
    
    render (predictedGameState){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        this.renderMap();
        this.renderRacers(predictedGameState);
    }
    
    renderMap (){
        let map = MAPS[this.mapName];
        for (let r = 0; r < map.length; r++) {
            for (let c = 0; c < map[r].length; c++) {
                
                //Figure out which sprite to take from sprite sheet
                let tileNum = map[r][c];
                let tileImage = images.grassSheet;
                let sx = MAP_TO_SPRITESHEET[tileNum][0] * TILE_SIZE[0];
                let sy = MAP_TO_SPRITESHEET[tileNum][1] * TILE_SIZE[1];
                let sh = TILE_SIZE[0];
                let sw = TILE_SIZE[1];
                
                //Figure out where to draw the tile on canvas
                let relativeX = (c - r)*(TILE_DRAW_SIZE[0]/2);
                let relativeY = (c + r)*(TILE_DRAW_SIZE[1]/2);
                let dx = relativeX;
                let dy = relativeY;
                let dw = TILE_DRAW_SIZE[0];
                let dh = TILE_DRAW_SIZE[1];
                
                let matrixedOutput = this.cameraMatrix(dx, dy, dw, dh);
                
                dx = matrixedOutput[0];
                dy = matrixedOutput[1];
                dw = matrixedOutput[2];
                dh = matrixedOutput[3];
                
                ctx.drawImage(tileImage, sx, sy, sh, sw, dx, dy, dw, dh);
            }
        }
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
                
                let dx = racer.pos.x - RACER_DRAW_SIZE[0]/2;
                let dy = racer.pos.y/2 - RACER_DRAW_SIZE[1]/2 - RACER_STACK_HEIGHT*i;
                let dw = RACER_DRAW_SIZE[0];
                let dh = RACER_DRAW_SIZE[1];
                
                let matrixedOutput = this.cameraMatrix(dx, dy, dw, dh);
                dx = matrixedOutput[0];
                dy = matrixedOutput[1];
                dw = matrixedOutput[2];
                dh = matrixedOutput[3];
                
                let cx = racer.pos.x;
                let cy = racer.pos.y/2;
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
    cameraMatrix(x,y,w,h){
        let nx = ((x - this.camera.x) * this.camera.zoom) * S + canvas.width/2;
        let ny = ((y - this.camera.y) * this.camera.zoom) * S + canvas.height/2;
        let nw = (w * this.camera.zoom) * S;
        let nh = (h * this.camera.zoom) * S;
        return [nx,ny,nw,nh];
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