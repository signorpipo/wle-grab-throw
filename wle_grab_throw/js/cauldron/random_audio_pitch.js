WL.registerComponent('random-audio-pitch', {
    _myMin: { type: WL.Type.Float, default: 1.0 },
    _myMax: { type: WL.Type.Float, default: 1.0 },
}, {
    init: function () {
        this._myAudio = this.object.getComponent("howler-audio-source");

        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Min Pitch", 1, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Max Pitch", 1, 0.5, 4));
    },
    start: function () {
    },
    update: function (dt) {
        this._myMin = PP.EasyTuneVariables.get("Min Pitch").myValue;
        this._myMax = PP.EasyTuneVariables.get("Max Pitch").myValue;

        let randomPitch = Math.random() * (this._myMax - this._myMin) + this._myMin;
        this._myAudio.audio.rate(randomPitch); //fail, produce weird sound
    },
});