var game;
window.onload = function() {
    var w = 480;
    var h = 640;
    var isMobile = navigator.userAgent.indexOf("Mobile");
    if (isMobile === -1) {
        isMobile = navigator.userAgent.indexOf("Tablet");
    }
    if (isMobile !== -1){
        w = window.innerWidth;
        h = window.innerHeight;
    }
    var config = {
        type: Phaser.AUTO,
        width: w,
        height: h,
        parent: 'phaser-game',
        scene: [SceneTitle, SceneMain]
    };
    game = new Phaser.Game(config);
};
