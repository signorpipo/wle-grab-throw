WL.registerComponent('spawn-particles', {
    _myObject1: { type: WL.Type.Object },
    _myObject2: { type: WL.Type.Object },
    _myObject3: { type: WL.Type.Object },
    _myObject4: { type: WL.Type.Object },
    _myObject5: { type: WL.Type.Object },
    _myObject6: { type: WL.Type.Object },
    _myObject7: { type: WL.Type.Object },
    _myObject8: { type: WL.Type.Object },
    _myObject9: { type: WL.Type.Object },
    _myObject10: { type: WL.Type.Object },
    _myObject11: { type: WL.Type.Object },
    _myObject12: { type: WL.Type.Object }

}, {
    init: function () {
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Par Min Angle", 30, 5, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Par Max Angle", 80, 5, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Par Min Strength", 100, 50, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Par Max Strength", 400, 50, 2));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Par Min Scale", 0.025, 0.01, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Par Max Scale", 0.075, 0.01, 4));
    },
    start: function () {
        this._myAudio = this.object.addComponent("howler-audio-source", { "src": "assets/sound/sfx/strike.mp3" });
        //this._myAudio.spatial = false;

        this._myObjectList = [this._myObject1, this._myObject2, this._myObject3, this._myObject4, this._myObject5, this._myObject6, this._myObject7, this._myObject8, this._myObject9,
        this._myObject10, this._myObject11, this._myObject12];
        this._myPhysxList = [];

        for (let i = 0; i < this._myObjectList.length; ++i) {
            let object = this._myObjectList[i];
            object.resetTranslationRotation();
            this._myPhysxList.push(object.getComponent('physx'));
            this._myPhysxList[i].kinematic = false;
            this._myPhysxList[i].addForce([0, -200, 0]);
        }

        this._mySpawn = false;
        this._mySpawned = false;
        this._myCurrentParticles = [];

        this._myMinVerticalAngle = 30;
        this._myMaxVerticalAngle = 80;
        this._myMinStrength = 100;
        this._myMaxStrength = 400;

        this._myMinScale = 0.025;
        this._myMaxScale = 0.075;

        this._myCount = 0;
    },
    update: function (dt) {
        this._myMinVerticalAngle = PP.EasyTuneVariables.get("Par Min Angle").myValue;
        this._myMaxVerticalAngle = PP.EasyTuneVariables.get("Par Max Angle").myValue;
        this._myMinStrength = PP.EasyTuneVariables.get("Par Min Strength").myValue;
        this._myMaxStrength = PP.EasyTuneVariables.get("Par Max Strength").myValue;
        this._myMinScale = PP.EasyTuneVariables.get("Par Min Scale").myValue;
        this._myMaxScale = PP.EasyTuneVariables.get("Par Max Scale").myValue;

        if (this._mySpawned) {
            this._myCount++;
            if (this._myPhysxList[0].kinematic && this._myCount > 1) {
                for (let i = 0; i < this._myPhysxList.length; ++i) {
                    this._myPhysxList[i].kinematic = false;

                    let force = [0, 0, 1];

                    let verticalAngle = glMatrix.glMatrix.toRadian(Math.random() * (this._myMaxVerticalAngle - this._myMinVerticalAngle) + this._myMinVerticalAngle);
                    let horizontalAngle = glMatrix.glMatrix.toRadian(Math.random() * 360);
                    let strength = Math.random() * (this._myMaxStrength - this._myMinStrength) + this._myMinStrength;

                    glMatrix.vec3.rotateX(force, force, [0, 0, 0], -verticalAngle);
                    glMatrix.vec3.rotateY(force, force, [0, 0, 0], horizontalAngle);
                    glMatrix.vec3.normalize(force, force);
                    glMatrix.vec3.scale(force, force, strength);

                    this._myPhysxList[i].addForce(force);
                    this._myPhysxList[i].addTorque(force);

                    let scale = Math.random() * (this._myMaxScale - this._myMinScale) + this._myMinScale;
                    let object = this._myObjectList[i];
                    object.resetScaling();
                    object.scale([scale, scale, scale]);
                }
            }
        }

        if (this._mySpawn) {
            let pitch = Math.random() * (1.5 - 0.75) + 0.75;
            this._myAudio.audio._pannerAttr.refDistance = 3;
            this._myAudio.audio.rate(pitch);
            this._myAudio.play();
            this._myCount = 0;
            this._mySpawned = true;
            this._mySpawn = false;
            for (let i = 0; i < this._myObjectList.length; ++i) {
                let object = this._myObjectList[i];
                object.resetTranslationRotation();
                this._myPhysxList[i].kinematic = true;
            }
        }
    },
    spawn() {
        this._mySpawn = true;
    }
});