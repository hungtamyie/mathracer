//To be ran when the page is loaded. Loads all images, sounds, and changes sizes of elements so that they are correctly displayed

var canvas;
var ctx;
var S = 1;
var gameHandler;
window.onload = function(){
    loadCanvas();
    loadImages();
}

function loadCanvas(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
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
let imagesToLoad = ["beginnermap", "car3dnew", "beginnermapDATA", "grassSheet"];
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