class TiledBackground extends Phaser.GameObjects.Group {
    constructor(config) {
        super(config.scene);
        this.scene = config.scene;
        this.key = config.key;
        this.yy = 0;
        this.xx = 0;
        this.addTile();
    }
    addTile(){
        var tile = this.scene.add.image(this.xx, this.yy, this.key);
        this.add(tile);
        Align.scaleToGameW(tile, .2);
        this.xx += tile.displayWidth;

        if(this.xx > game.config.width + tile.displayWidth){
            this.yy += tile.displayHeight;
            this.xx = 0;
        }

        if(this.yy < game.config.height + tile.displayHeight){
            this.addTile();
        }
    }
}