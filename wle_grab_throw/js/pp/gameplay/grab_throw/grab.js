WL.registerComponent('grab', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myCollider: { type: WL.Type.Object }
}, {
    init: function () {
        this._myGamepad = null;

        if (this._myHandedness + 1 == PP.HandednessIndex.LEFT) {
            this._myGamepad = PP.LeftGamepad;
        } else {
            this._myGamepad = PP.RightGamepad;
        }

        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_START, this, this.grabStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_END, this, this.grabEnd.bind(this));

        this._myColliderComponent = this._myCollider.getComponent('collision');

        this._myGrabbed = null;
    },
    start: function () {
    },
    update: function (dt) {
    },
    grabStart: function (e) {
        if (!this._myGrabbed) {
            let collidingComps = this._myColliderComponent.queryOverlaps();
            for (let i = 0; i < collidingComps.length; i++) {
                let grabbable = collidingComps[i].object.getComponent("grabbable");
                if (grabbable) {
                    this._myGrabbed = grabbable;
                    this._myGrabbed.grab(this.object);
                    break;
                }
            }
        }
    },
    grabEnd: function (e) {
        if (this._myGrabbed) {
            this._myGrabbed.release(1, 1);
            this._myGrabbed = null;
        }
    }
});