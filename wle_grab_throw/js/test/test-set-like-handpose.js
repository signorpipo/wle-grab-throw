WL.registerComponent('test-set-like-handpose', {
}, {
    init: function () {
        this._myHandPose = new PP.HandPose("right");
    },
    start: function () {
        this._myHandPose.start();
    },
    update: function (dt) {
        this._myHandPose.update(dt);


        this.object.setTranslationLocal(this._myHandPose.getPosition());

        /*
        let rotation = this._myHandPose.getRotation();
        let quat = [];
        glMatrix.quat.fromEuler(quat, PP.MathUtils.toDegrees(rotation[0]), PP.MathUtils.toDegrees(rotation[1]), PP.MathUtils.toDegrees(rotation[2]));
        let quat2 = [];
        glMatrix.quat2.fromRotation(quat2, quat);
        this.object.trasformLocal = quat2;
        */

        this.object.resetRotation();
        let quat = PP.MathUtils.eulerToQuaternion(PP.MathUtils.quaternionToEuler(this._myHandPose.getRotation()));
        this.object.rotateObject(quat);
    },
});