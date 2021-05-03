WL.registerComponent('test-react-on-collision', {
}, {
    init: function () {
        this._myPhysx = this.object.getComponent('physx');
        this._mySpawner = this.object.getComponent('spawn-particles');
        if (this._myPhysx && this._myPhysx.active) {
            this._myPhysx.onCollision(this._onCollision.bind(this));
        }

        this._myCollision = this.object.getComponent('collision');
    },
    start: function () {
    },
    update: function (dt) {
        if (this._myCollision && this._myCollision.active) {
            let overlaps = this._myCollision.queryOverlaps();
            if (overlaps.length > 0) {
                if (!this._myCollisionOn) {
                    this._onCollision();
                }
            } else {
                this._myCollisionOn = false;
            }
        }
    },
    _onCollision() {
        PP.RightGamepad.pulse(0.5, 0.5);
        this._mySpawner.spawn();
        this._myCollisionOn = true;
    }
});