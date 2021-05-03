WL.registerComponent('spawn-grabbable', {
    _myObject1: { type: WL.Type.Object },
    _myObject2: { type: WL.Type.Object },
    _myObject3: { type: WL.Type.Object },
    _myObject4: { type: WL.Type.Object },
    _myObject5: { type: WL.Type.Object },
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
        this._myObjectList = [this._myObject1, this._myObject2, this._myObject3, this._myObject4, this._myObject5];

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
        if (this._myCurrentObject) {
            let currentTranslation = [];
            let objectTranslation = [];

            this._myCurrentObject.getTranslationWorld(currentTranslation);
            this.object.getTranslationWorld(objectTranslation);

            if (glMatrix.vec3.distance(currentTranslation, objectTranslation) > 0.1) {
                this._selectObject();
            }
        }

        //this.object.setTranslationLocal([PP.EasyTuneVariables.get("X").myValue, PP.EasyTuneVariables.get("Y").myValue, PP.EasyTuneVariables.get("Z").myValue]);
    },
    _selectObject() {
        let index = this._myCurrentIndex;
        while (index == this._myCurrentIndex) {
            index = Math.floor(Math.random() * this._myObjectList.length);
        }

        this._myCurrentIndex = index;
        this._myCurrentObject = this._myObjectList[this._myCurrentIndex];

        this._myCurrentObject.parent = this.object;
        this._myCurrentObject.resetTranslationRotation();
        this._myCurrentObject.setTranslationLocal([0, 0, 0]);
        this._myCurrentObject.getComponent("physx").kinematic = true;
    }
});