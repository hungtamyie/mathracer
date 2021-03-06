<?php 
    //must be logged in to race
    session_start();
    if(empty($_SESSION['username'])) {
       header("Location: login.php");  
       die();
    }
    include("includes/header.php");
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Racer</title>
        <script src="scripts/Entities.js"></script>
        <script src="scripts/maps.js"></script>
        <script src="scripts/Particle.js"></script>
        <script src="scripts/loader.js"></script>
        <script src="scripts/vector.js"></script>
        <script src="scripts/client.js"></script>
        <script src="scripts/Racer.js"></script>
        <script src="scripts/Game.js"></script>
        <style>
            #canvas {
                background: grey;
                display: block;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-crisp-edges;
                image-rendering: pixelated;
                image-rendering: crisp-edges;
            }
            body {
                margin: 0px;
            }
            #editorTools {
                display: show;
            }
        </style>
    </head>
    <body>
        <canvas id="canvas" width="1500px" height="900px"></canvas>
        <div id="debug"></div>
        <div id="editorTools">
        <button onclick="downloadObjectAsJson(MAPS.beginner.entities, 'images');">download</button>
        <button onclick="let obj = new TireBlack(0, 0); gameHandler.game.mapEntities.push(obj); changing=true; MAPS.beginner.entities.push(['blackTire', 0,0])">Tire Black</button>
        <button onclick="let obj = new TireRedWhite(0, 0); gameHandler.game.mapEntities.push(obj); changing=true; MAPS.beginner.entities.push(['redWhiteTire', 0,0])">Tire red white</button>
        <button onclick="let obj = new TireWhiteRed(0, 0); gameHandler.game.mapEntities.push(obj); changing=true; MAPS.beginner.entities.push(['whiteRedTire', 0,0])">Tire white red</button>
        <button onclick="let obj = new BarrierLeft(0, 0); gameHandler.game.mapEntities.push(obj); changing=true; MAPS.beginner.entities.push(['barrierLeft', 0,0])">Barrier left</button>
        <button onclick="let obj = new BarrierRight(0, 0); gameHandler.game.mapEntities.push(obj); changing=true; MAPS.beginner.entities.push(['barrierRight', 0,0])">Barrier right</button>
        <button onclick="MAPS.beginner.entities.pop(); gameHandler.game.mapEntities.pop()">Undo</button>
        </div>
    </body>
</html>