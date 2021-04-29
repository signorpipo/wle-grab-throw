WL.registerComponent('test-hand-pose', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
}, {
    init: function () {
        this._myHandPose = new PP.HandPose(PP.InputUtils.getHandednessByIndex(this._myHandedness + 1));
        this._myCount = 0;
    },
    start: function () {
        this._myHandPose.start();
    },
    update: function (dt) {
        this._myHandPose.update(dt);

        this._myCount++;

        if (this._myCount >= 10) {
            this._myCount = 0;
            console.log(
                "Position", this._myHandPose.getPosition().map(function (a) { return a.toFixed(4); }), "\n",
                "Rotation", this._myHandPose.getRotation().map(function (a) { return a.toFixed(4); }), "\n",
                "Linear Velocity", this._myHandPose.getLinearVelocity().map(function (a) { return a.toFixed(4); }), "\n",
                "Angular Velocity", this._myHandPose.getAngularVelocity().map(function (a) { return a.toFixed(4); }), "\n");
        }
    },
});