WL.registerComponent('grab-sfx', {
    _myGrabSFX: { type: WL.Type.Object },
    _myThrowSFX: { type: WL.Type.Object }
}, {
    init: function () {
        this._myGrabSFXComponent = this._myGrabSFX.getComponent("howler-audio-source");
        this._myThrowSFXComponent = this._myThrowSFX.getComponent("howler-audio-source");

        this._myGrab = this.object.getComponent("grab");

        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Throw Max Volume Thres", 5, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Min Pitch", 0.75, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Max Pitch", 1.5, 0.5, 4));
    },
    start: function () {
        this._myGrab.registerGrabEventListener(this, this._onGrab.bind(this));
        this._myGrab.registerThrowEventListener(this, this._onThrow.bind(this));
    },
    _onGrab(grabber, grabbable) {
        let pitch = Math.random() * (PP.EasyTuneVariables.get("Max Pitch").myValue - PP.EasyTuneVariables.get("Min Pitch").myValue) + PP.EasyTuneVariables.get("Min Pitch").myValue;
        this._myGrabSFXComponent.audio.rate(pitch);
        this._myGrabSFXComponent.play();
    },
    _onThrow(grabber, grabbable, linearVelocity, angularVelocity) {
        let volume = Math.max(0.4, Math.min(1, glMatrix.vec3.length(linearVelocity) / PP.EasyTuneVariables.get("Throw Max Volume Thres").myValue));

        let pitch = Math.random() * (1.5 - 0.75) + 0.75;
        this._myThrowSFXComponent.audio.rate(pitch);
        this._myThrowSFXComponent.audio.volume(volume);
        this._myThrowSFXComponent.play();
    },
});