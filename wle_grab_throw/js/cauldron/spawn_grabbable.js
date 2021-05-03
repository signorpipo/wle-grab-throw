WL.registerComponent('spawn-grabbable', {
    _myObject1: { type: WL.Type.Object },
    _myObject2: { type: WL.Type.Object },
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
        this._myObjectList = [this._myObject1, this._myObject2];

        for (let i = 0; i < this._myObjectList.length; ++i) {
            let object = this._myObjectList[i];
            object.resetTranslationRotation();
            object.setTranslationLocal([0, -2000, 0]);
        }

        this._myCurrentObject = null;
        this._selectObject();

    },
    start: function () {
    },
    update: function (dt) {
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd()) {
            this._selectObject();
        }

        //this.object.setTranslationLocal([PP.EasyTuneVariables.get("X").myValue, PP.EasyTuneVariables.get("Y").myValue, PP.EasyTuneVariables.get("Z").myValue]);
    },
    _selectObject() {
        if (this._myCurrentObject) {
            this._myCurrentObject.parent = this.object;
            this._myCurrentObject.resetTranslationRotation();
            this._myCurrentObject.setTranslationLocal([0, -2000, 0]);
            this._myCurrentObject.getComponent("physx").kinematic = true;

            this._myCurrentObject = null;
        }

        let randomIndex = Math.floor(Math.random() * this._myObjectList.length);
        this._myCurrentObject = this._myObjectList[randomIndex];

        this._myCurrentObject.setTranslationLocal([0, 0, 0]);
    }
});