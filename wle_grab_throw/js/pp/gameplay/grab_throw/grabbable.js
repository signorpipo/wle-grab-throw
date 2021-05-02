WL.registerComponent('grabbable', {
}, {
    init: function () {
        this.myPhysx = this.object.getComponent('physx');
        this.myIsGrabbed = false;

        this._myOldParent = this.object.parent;
    },
    grab: function (grabber) {
        if (!this.myIsGrabbed) {
            this.myPhysx.kinematic = true;

            this._myOldParent = this.object.parent;
            PP.ObjectUtils.reparentKeepTransform(this.object, grabber);

            this.myIsGrabbed = true;
        }
    },
    release: function (linearVelocity, angularVelocity) {
        if (this.myIsGrabbed) {
            PP.ObjectUtils.reparentKeepTransform(this.object, this._myOldParent);
            this.myIsGrabbed = false;
            this.myPhysx.kinematic = false;

            this.myPhysx.linearVelocity = linearVelocity;
            this.myPhysx.angularVelocity = angularVelocity;
        }
    }
});