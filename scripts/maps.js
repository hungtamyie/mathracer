class Map {
    constructor(args){
        this.name = args.name;
        this.width = args.width;
        this.height = args.height;
        this.image = args.image;
        this.dataImage = args.dataImage;
        this.drawScale = args.drawScale;
        this.dataScale = args.dataScale;
        this.backgroundImage = args.backgroundImage;
        this.entities = args.entities;
    }
}

var MAPS = {
    beginner: new Map({
        name: "beginner",
        width: 3200,
        height: 1800,
        image: "beginnermap",
        dataImage: "beginnermapDATA",
        drawScale: 0.5,
        dataScale: 1/4,
        backgroundImage: "grassSheet",
        entities: [["blackTire",1140.8,1237.2],["blackTire",1148.4,1187.6],["blackTire",1165.1,1151.3],["blackTire",1189.6,1127.2],["barrierLeft",368.8,339.7],["barrierLeft",383.1,352.4],["barrierLeft",396.3,365.1],["barrierLeft",409.5,377.8],["blackTire",386.8,331.2],["blackTire",413.2,357.7],["blackTire",438.6,360.8],["redWhiteTire",142.3,113.2],["whiteRedTire",120.6,117.5],["redWhiteTire",102.1,136.5],["whiteRedTire",81,171.4],["redWhiteTire",60.8,209.5],["whiteRedTire",44.4,250.8],["whiteRedTire",164,104.8],["redWhiteTire",185.7,95.2],["barrierLeft",420.1,1159.8],["blackTire",438.6,1177.8],["barrierRight",457.1,1164],["barrierLeft",403.7,1149.2],["barrierRight",475.7,1151.3],["blackTire",384.1,1138.6],["blackTire",491,1136.5],["blackTire",320.1,1063.5],["barrierLeft",144.4,1664.6],["blackTire",344.4,1086.8],["blackTire",365.1,1110.1],["blackTire",441.8,748.1],["blackTire",474.1,782],["blackTire",461.4,759.8],["blackTire",452.4,787.3],["blackTire",430.2,790.5],["blackTire",621.7,1336.5],["blackTire",600,1363],["blackTire",642.9,1360.8],["whiteRedTire",273.5,1457.1],["redWhiteTire",285.2,1485.7],["whiteRedTire",295.2,1532.3],["redWhiteTire",264.6,1415.9],["whiteRedTire",331.7,1587.3],["redWhiteTire",312.2,1556.6],["redWhiteTire",349.7,1607.4],["barrierLeft",1012.2,1412.7],["barrierLeft",995.8,1398.9],["barrierLeft",979.4,1381],["barrierLeft",961.9,1361.9],["blackTire",968.8,1342.9],["blackTire",987.8,1374.6],["blackTire",946.6,1346],["whiteRedTire",1202.6,1772.5],["redWhiteTire",1188.9,1795.8],["whiteRedTire",924.9,1806.3],["redWhiteTire",934.4,1841.3],["whiteRedTire",957.1,1851.9],["redWhiteTire",981,1860.3],["whiteRedTire",1007.4,1863.5],["redWhiteTire",1031.7,1866.7],["whiteRedTire",1058.7,1864.6],["redWhiteTire",1086.2,1857.1],["whiteRedTire",1107.9,1852.9],["redWhiteTire",1136.5,1841.3],["whiteRedTire",1166.7,1819],["redWhiteTire",1226.5,1764],["whiteRedTire",1247.1,1749.2],["redWhiteTire",1264,1723.8],["whiteRedTire",1276.2,1685.7],["redWhiteTire",1284.7,1657.1],["barrierRight",1214.3,749.2],["barrierRight",1230.2,729.1],["barrierLeft",1203.7,625.4],["barrierLeft",1222.2,647.6],["blackTire",1244.4,667.7],["blackTire",1241.8,719.6],["blackTire",1265.1,695.2],["redWhiteTire",1522.2,854],["whiteRedTire",1534.9,825.4],["redWhiteTire",1545.5,789.4],["whiteRedTire",1552.4,745],["redWhiteTire",1556.1,701.6],["whiteRedTire",1557.1,654],["redWhiteTire",1555.6,608.5],["whiteRedTire",1550.8,561.9],["barrierRight",1204.8,1073],["barrierRight",1221.2,1054],["barrierRight",1241.3,1034.9],["barrierRight",1260.3,1021.2],["barrierRight",1277.2,1006.3],["barrierRight",1198.9,777.8],["barrierRight",1181,807.4],["barrierRight",1159.3,818],["barrierRight",1138.6,838.1],["redWhiteTire",1539.2,533.3],["whiteRedTire",1523.8,514.3],["blackTire",1507.4,495.2],["blackTire",1505.8,885.7],["blackTire",545.5,68.8],["blackTire",567.2,60.3],["blackTire",591.5,59.3],["blackTire",611.6,66.7]]
    })    
};


var RACER_SIZE = [256,256];
var RACER_DRAW_SIZE = [60,60];
var RACER_STACK_HEIGHT = 2.7;
var RACER_DRAW_OFFSET = -20;
var RACER_ROTATION_OFFSET = 30;
var BACKGROUND_SHEET_SIZE = 160;

var SETTINGS = {
    "BINDS": {
        "Drive_forwards": "w",
        "Drive_backwards": "s",
        "Turn_left": "a",
        "Turn_right": "d",
    },
    "CAMERA": {
        "max_distance_forwards": 100,
        "stiffness": 30,
        "minzoom": 1,
        "maxzoom": 2,
        "zoomStiffness": 100,
    },
    "GRAPHICS": {
        "fps": 1000,
    }
}
