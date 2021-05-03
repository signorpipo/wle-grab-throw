WL.registerComponent('move_target', {
    _myPhysx: { type: WL.Type.Object }
}, {
    init: function () {
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Target X", 0, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Target Y", 0.5, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Target Z", -3, 0.5, 4));
    },
    start: function () {
    },
    update: function (dt) {
        this.object.setTranslationLocal([PP.EasyTuneVariables.get("Target X").myValue, PP.EasyTuneVariables.get("Target Y").myValue, PP.EasyTuneVariables.get("Target Z").myValue]);
    },
});