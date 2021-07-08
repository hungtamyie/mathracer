class Game {
    //Takes args (map, racers)
    constructor(args) {
        this.mapName = args.map;
        this.racers = args.racers;
    }
    
    updateState(delta){
        for (const property in this.racers) {
            let racer = this.racers[property];
            racer.update(delta)
        }
    }
}