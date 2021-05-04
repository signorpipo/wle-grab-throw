WL.registerComponent('grab-extra', {
}, {
    init: function () {
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Min Thres", 0.6, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Max Thres", 2.5, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Damp", 1.75, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Max", 15, 1, 4));

        this._myGrab = this.object.getComponent('grab');
    },
    start: function () {
    },
    update: function (dt) {

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressStart()) {
            this._myGrab._mySnapOnPivot = !this._myGrab._mySnapOnPivot;
        }
        this._myGrab._myThrowLinearStrengthMinThreshold = PP.EasyTuneVariables.get("Min Thres").myValue;
        this._myGrab._myThrowLinearStrengthMaxThreshold = PP.EasyTuneVariables.get("Max Thres").myValue;
        this._myGrab._myThrowLinearStrengthExtraPercentage = PP.EasyTuneVariables.get("Damp").myValue;
        this._myGrab._myThrowLinearMaxStrength = PP.EasyTuneVariables.get("Max").myValue;
    },
});