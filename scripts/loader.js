//To be ran when the page is loaded. Loads all images, sounds, and changes sizes of elements so that they are correctly displayed


//TEMPORARY VIARIABLES
var changing = false;
//TEMOPORARY VARIABLES

var canvas;
var ctx;
var racerCanvas;
var racerCtx;
var S = 1;
var gameHandler;
window.onload = function(){
    loadCanvas();
    loadImages();
}

function loadCanvas(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    racerCanvas = document.createElement('canvas');
    racerCanvas.width = RACER_SIZE[0];
    racerCanvas.height = RACER_SIZE[1];
    racerCtx = racerCanvas.getContext("2d");
    document.getElementById("debug").append(racerCanvas);
        
    resizeCanvas();
    window.onresize = resizeCanvas;
}

function resizeCanvas(){
    let w = window.innerWidth;
    let h = window.innerHeight;
    
    if (h * 16/9 <= w) {
        canvas.height = h;
        canvas.width = h * 16/9;
    }
    else {
        canvas.height = w * 9/16;
        canvas.width = w;
    }
    
    S = canvas.width/800;
}

let images = {};
let imagesToLoad = ["beginnermap", "car3dnew", "beginnermapDATA", "grassSheet", "obstacleSheet", "particleSheet"];
let imagesLoaded = 0;
function loadImages(){
    for (let i = 0; i < imagesToLoad.length; i++) {
        images[imagesToLoad[i]] = loadImage(imagesToLoad[i] + ".png");
    }
}

function loadImage(url){
    var image = new Image();
    image.addEventListener("load", imageLoaded, false);
    image.src = url;
    return image;
}

function imageLoaded(){
    imagesLoaded++;
    if (imagesLoaded == imagesToLoad.length){
        console.log("all images loaded");
        gameHandler = new GameHandler();
        gameHandler.tick();
    }
}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}