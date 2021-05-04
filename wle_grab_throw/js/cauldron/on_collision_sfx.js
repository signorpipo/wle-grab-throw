WL.registerComponent('on-collision-sfx', {
}, {
    init: function () {
        this._myAudio = this.object.addComponent("howler-audio-source", { "src": "assets/sound/sfx/collision.mp3" });
        this._myAudio.spatial = false;
        this._myTime = 0;
    },
    start: function () {
        this._myPhysx = this.object.getComponent("physx");
        this._myGrabbable = this.object.getComponent("grabbable");
        this._myPhysx.onCollision(this._onCollision.bind(this));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Rolloff", 0.5, 1.5, 4));
    },
    update: function (dt) {
        this._myTime += dt;
    },
    _onCollision: function (type, other) {
        // Ignore uncollides
        if (type == WL.CollisionEventType.TouchLost) return;

        if (this._myTime > 1) {
            this._myAudio.audio._pannerAttr.refDistance = 5;
            this._myAudio.audio._pannerAttr.rolloffFactor = PP.EasyTuneVariables.get("Rolloff").myValue;
            let origin = [];
            this.object.getTranslationWorld(origin);
            let pitch = Math.random() * (1.5 - 0.75) + 0.75;
            this._myAudio.audio.rate(pitch);
            this._myAudio.audio.pos(origin[0], origin[1], origin[2]);
            this._myAudio.audio.play();
        }
    },
});