WL.registerComponent('move-on-sphere', {
}, {
    init: function () {
        this._myCurrentTime = 0;

        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Max Radius X", 2, 1, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Max Radius Y", 1, 1, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Max Radius Z", 1, 1, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("X Speed", 0.8, 1, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Y Speed", 0.4, 1, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Z Speed", 0.4, 1, 2));
    },
    start: function () {
    },
    update: function (dt) {
        let maxRadiusX = PP.EasyTuneVariables.get("Max Radius X").myValue;
        let maxRadiusY = PP.EasyTuneVariables.get("Max Radius Y").myValue;
        let maxRadiusZ = PP.EasyTuneVariables.get("Max Radius Z").myValue;
        let speedX = PP.EasyTuneVariables.get("X Speed").myValue;
        let speedY = PP.EasyTuneVariables.get("Y Speed").myValue;
        let speedZ = PP.EasyTuneVariables.get("Z Speed").myValue;

        this._myCurrentTime += dt;

        let radiusX = Math.min(maxRadiusX * this._myCurrentTime / 2, maxRadiusX);
        let radiusY = Math.min(maxRadiusY * this._myCurrentTime / 2, maxRadiusY);
        let radiusZ = Math.min(maxRadiusZ * this._myCurrentTime / 2, maxRadiusZ);

        let x = Math.sin(this._myCurrentTime * speedX) * radiusX;
        let y = Math.cos(this._myCurrentTime * speedY) * radiusY;
        let z = Math.sin(this._myCurrentTime * speedZ) * radiusZ;

        this.object.setTranslationLocal([x, y, z]);
    },
});