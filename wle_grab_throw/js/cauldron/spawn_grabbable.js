WL.registerComponent('spawn-grabbable', {
    _myObject: { type: WL.Type.Object },
    //_myMesh: { type: WL.Type.Mesh },
    //_myRadius: { type: WL.Type.Int, default: 1 }
}, {
    init: function () {
        /*
        this._myPhysix = this.object.addComponent("physx",
            {
                "shape": WL.Shape.Sphere,
                "radius": this._myRadius,
                "kinematic": true,
                "mass": 1,
                "linearDamping": 0,
                "angularDamping": 0.05
            });
        let a = 2;
        */
    },
    start: function () {
    },
    update: function (dt) {
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd()) {
            this._myObject.parent = this.object;
            this._myObject.resetTranslationRotation();
            this._myObject.getComponent("physx").kinematic = true;
        }

        let temp = this._myObject.scalingWorld; //#BUG physx not updating and weird scaling without calling this getter (???)

        //this.object.setTranslationLocal([PP.EasyTuneVariables.get("X").myValue, PP.EasyTuneVariables.get("Y").myValue, PP.EasyTuneVariables.get("Z").myValue]);
    },
});