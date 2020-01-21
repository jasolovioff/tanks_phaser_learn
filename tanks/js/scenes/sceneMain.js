class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    };
    preload(){
        this.load.image("dirt", "images/main/dirt.png");
        this.load.image("tank1", "images/main/tank1.png");
        this.load.image("tank2", "images/main/tank2.png");
        this.load.image("smoke", "images/main/smoke.png");
        this.load.image("bullet1", "images/main/bullet1.png");
        this.load.image("bullet2", "images/main/bullet2.png");
    };
    create(){
        this.firedFlag = false;
        this.canFire = false;
        this.messages = [];
        this.setUpMessages();
        this.background = new TiledBackground({
            scene: this,
            key: 'dirt'
        });
        this.makeRiver();
        this.aGrid = new AlignGrid({scene: this});
        this.aGrid.showNumbers();
        this.placeTanks();
        this.input.on("pointerdown", this.clicked, this);
        this.messageText = this.add.text(0, 0, "Message");
        this.messageText.setOrigin(0.5, 0.5);
        Align.center(this.messageText);
        this.messageTimer = this.time.addEvent({
            delay: 1000,
            callback: this.setNextMessage,
            callbackScope: this,
            loop: true
        });
    };
    clicked(){
        console.log("clicked!");
        if(this.canFire == true){
            this.showBullet(this.tank1, this.tank2);
        }else{
            this.setLoseMessage("Fired too early!");
            this.showBullet(this.tank2, this.tank1);
        }
    }
    makeRiver(){
        this.river = this.add.graphics();

        this.river.fillStyle(0x12E5E8, 1);

        var riverH = game.config.height * .2;

        this.river.fillRect(0, 0, game.config.width, riverH);

        this.river.y = game.config.height / 2 - riverH / 2;
    }
    placeTanks(){
        this.tank1 = this.add.image(0, 0, "tank1");
        this.tank2 = this.add.image(0, 0, "tank2");

        Align.scaleToGameW(this.tank1, .2);
        Align.scaleToGameW(this.tank2, .2);

        this.aGrid.placeAtIndex(2, this.tank2);
        this.aGrid.placeAtIndex(22, this.tank1);
    }
    showSmoke(tank){
        var smoke = this.add.image(0,0, "smoke");
        Align.scaleToGameW(smoke, 2);
        var ty = 0;
        if(tank === this.tank1){
            this.aGrid.placeAtIndex(7, smoke);
            ty = game.config.height;
        }else{
            this.aGrid.placeAtIndex(17, smoke);
        }

        this.tweens.add({
            targets: smoke,
            duration: 1500,
            y: ty,
            scaleX: 0,
            scaleY: 0,
            alpha: 0
        });
    }
    showBullet(firedTank, hitTank){
        if (this.firedFlag){
            return;
        }
        this.firedFlag = true;
        this.messageTimer.remove(false);
        this.showSmoke(firedTank);
        var ty = hitTank.y;

        if(firedTank == "bullet2"){
            var bulletKey = "bullet2";
            var startY = firedTank.y + firedTank.displayHeight/2;
            var angle = 180;
        }else{
            var bulletKey = "bullet1";
            var startY = firedTank.y - firedTank.displayHeight/2;
            var angle = 0;
        }

        var bullet = this.add.image(firedTank.x, startY, bulletKey);
        bullet.angle = angle;
        Align.scaleToGameW(bullet, .05);

        this.tweens.add({
            targets: bullet,
            duration: 200,
            y: ty,
            onComplete: this.onBulletComplete,
            onCompleteParams: [{tank: hitTank, scope: this}]
        });
    }
    onBulletComplete(tween, targets, custom){
        custom.scope.tankHit(custom.tank);
        targets[0].destroy();
    }
    tankHit(tank){
        var ty = 0;
        if(tank === this.tank1){
            ty = game.config.height;
        }
        var angle = Math.floor(Math.random()*90)-45;
        this.tweens.add({
            targets: tank,
            duration: 500,
            y: ty,
            angle: angle
        });
    }
    setUpMessages(){
        this.messages.push({
            text: "Ready",
            style: {
                fontFamily: 'ZCOOL QingKe HuangYou',
                fontSize: '46px',
                color: '#000000'
            }
        });
        this.messages.push({
            text: "Steady",
            style: {
                fontFamily: 'ZCOOL QingKe HuangYou',
                fontSize: '46px',
                color: '#000000'
            }
        });
        this.messages.push({
            text: "Fire!",
            style: {
                fontFamily: 'ZCOOL QingKe HuangYou',
                fontSize: '72px',
                color: '#ff0000'
            }
        });
    }
    setNextMessage(){
        var message = this.messages.shift();
        if (this.messages.length == 0){
            this.canFire = true;
            this.messageTimer.remove(false);
            //
            //
            var delay = 500 + Math.random()*1000;
            this.shootTimer = this.time.addEvent({
                delay: delay,
                callback: this.computerShoot,
                callbackScope: this,
                loop: false
            });
        }
        console.log(message);
        this.messageText.setText(message.text);
        this.messageText.setStyle(message.style);
    }
    computerShoot(){
        if (!this.firedFlag){
            this.setLoseMessage("Waited too long!")
        }
        this.showBullet(this.tank2, this.tank1);
    }
    setLoseMessage(reason){
        this.messageText.setText(reason);
        this.messageText.setStyle({fontFamily:'Fresca', fontSize: '64px', color: '#ff0000'});
    }
    update(){
        // constant running loop
    };
}