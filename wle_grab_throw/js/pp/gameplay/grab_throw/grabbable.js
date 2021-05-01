WL.registerComponent('grabbable', {
}, {
    init: function () {
        this._myPhysx = this.object.getComponent('physx');
        this._myIsGrabbed = false;

        this._myOldParent = this.object.parent;
    },
    grab: function (grabber) {
        if (!this._myIsGrabbed) {
            if (this._myPhysx) {
                this._myPhysx.kinematic = true;
            }

            this._myOldParent = this.object.parent;
            PP.ObjectUtils.reparentKeepTransform(this.object, grabber);

            this._myIsGrabbed = true;
        }
    },
    release: function (linearVelocityMultiplier, angularVelocityMultiplier) {
        if (this._myIsGrabbed) {
            this._ungrab();

            if (this._myPhysx) {
                this._myPhysx.linearVelocity = glMatrix.vec3.scale(this._myPhysx.linearVelocity, this._myPhysx.linearVelocity, linearVelocityMultiplier);
                this._myPhysx.angularVelocity = glMatrix.vec3.scale(this._myPhysx.angularVelocity, this._myPhysx.angularVelocity, angularVelocityMultiplier);
            }
        }
    },
    throw: function (linearVelocity, angularVelocity) {
        if (this._myIsGrabbed) {
            this._ungrab();

            if (this._myPhysx) {
                this._myPhysx.linearVelocity = linearVelocity;
                this._myPhysx.angularVelocity = angularVelocity;
            }
        }
    },
    _ungrab: function () {
        PP.ObjectUtils.reparentKeepTransform(this.object, this._myOldParent);
        this._myIsGrabbed = false;
        if (this._myPhysx) {
            this._myPhysx.kinematic = false;
        }
    }
});