class SceneTitle extends Phaser.Scene {
    constructor() {
        super('SceneTitle');
    };
    preload(){
        this.load.image("button1", "images/ui/buttonStart.png");
        this.load.image("title", "images/main/title.png");
    };
    create(){
        var btnStart = this.add.image(240,320,'button1');
        Align.scaleToGameW(btnStart, .4);
        btnStart.setInteractive();
        btnStart.on("pointerdown", this.startGame, this);
        var title = this.add.image(240, 100, 'title');
        Align.scaleToGameW(title, .9);
        this.alignGrid = new AlignGrid({rows:11, cols:11, scene:this});
        this.alignGrid.placeAtIndex(38, title);
        this.alignGrid.placeAtIndex(71, btnStart);
        this.alignGrid.showNumbers();
        console.log('SceneTitle');
        this.input.on("pointerdown", this.clicked, this);
    };
    update(){

    };

    clicked(){
        console.log("clicked!");
    };

    startGame(){
      this.scene.start('SceneMain');
    };
}