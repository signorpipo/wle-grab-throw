WL.registerComponent('grab', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myThrowStrengthExtraPercentage: { type: WL.Type.Float, default: 0.3 },
    _myCollider: { type: WL.Type.Object }
}, {
    init: function () {
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Min History", 2, 0.5));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Min", 2, 0.5));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Perc", 0.3, 0.5, 4));

        this._myGamepad = null;

        if (this._myHandedness + 1 == PP.HandednessIndex.LEFT) {
            this._myGamepad = PP.LeftGamepad;
        } else {
            this._myGamepad = PP.RightGamepad;
        }

        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_START, this, this._grabStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_END, this, this._grabEnd.bind(this));

        this._myColliderComponent = this._myCollider.getComponent('collision');

        this._myGrabbed = null;

        this._myHistorySize = 5;
        this._myHistoryStrengthAverageFromStart = 1;
        this._myHistoryDirectionAverageFromEnd = 4;
        this._myHistoryCurrentCount = 0;

        this._myGrabbedLinearVelocityHistory = new Array(this._myHistorySize);
        this._myGrabbedLinearVelocityHistory.fill(0);

        this._myThrowStrengthMinThreshold = 2;
        this._myThrowStrengthMaxThreshold = 7;

    },
    start: function () {
    },
    update: function (dt) {
        this._myThrowStrengthExtraPercentage = PP.EasyTuneVariables.get("Perc").myValue;
        this._myThrowStrengthMinThreshold = PP.EasyTuneVariables.get("Min").myValue;
        if (this._myGrabbed) {
            this._updateVelocityHistory();
        }
    },
    _grabStart: function (e) {
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

            if (this._myGrabbed) {
                this._myHistoryCurrentCount = 0;
                this._myGrabbedLinearVelocityHistory.fill(0);
            }
        }
    },
    _grabEnd: function (e) {
        if (this._myGrabbed) {
            let linearVelocity = this._myGrabbed.myPhysx.linearVelocity;

            if (this._myHistoryCurrentCount >= this._myHistorySize) {
                linearVelocity = this._computeReleaseLinearVelocity();
            }

            this._myGrabbed.release(linearVelocity, this._myGrabbed.myPhysx.angularVelocity);
            this._myGrabbed = null;
        }
    },
    _updateVelocityHistory() {
        this._myHistoryCurrentCount++;

        this._myGrabbedLinearVelocityHistory.unshift(this._myGrabbed.myPhysx.linearVelocity.slice(0));
        this._myGrabbedLinearVelocityHistory.pop();
        //console.log({ a: this._myGrabbedLinearVelocityHistory.map(function (a) { return a.map(function (b) { return b.toFixed(4); }); }) });
    },
    _computeReleaseLinearVelocity() {
        //direction
        let directionCurrentWeight = this._myHistoryDirectionAverageFromEnd;
        let direction = [0, 0, 0];
        for (let i = this._myHistorySize - this._myHistoryDirectionAverageFromEnd; i < this._myHistorySize; i++) {
            let currentDirection = this._myGrabbedLinearVelocityHistory[i];
            glMatrix.vec3.scale(currentDirection, currentDirection, directionCurrentWeight);
            glMatrix.vec3.add(direction, direction, currentDirection);

            directionCurrentWeight--;
        }
        glMatrix.vec3.normalize(direction, direction);

        //strength
        let strength = glMatrix.vec3.length(this._myGrabbedLinearVelocityHistory[0]);
        for (let i = 1; i < this._myHistoryStrengthAverageFromStart; i++) {
            strength += glMatrix.vec3.length(this._myGrabbedLinearVelocityHistory[i]);
        }
        strength /= this._myHistoryStrengthAverageFromStart;

        //console.log("originalll", strength);

        let strengthMultiplierIntensity = (strength - this._myThrowStrengthMinThreshold) / (this._myThrowStrengthMaxThreshold - this._myThrowStrengthMinThreshold); //linear equation
        strengthMultiplierIntensity = Math.min(1, Math.max(0, strengthMultiplierIntensity));

        strength += strength * this._myThrowStrengthExtraPercentage * strengthMultiplierIntensity;

        glMatrix.vec3.scale(direction, direction, strength);

        //console.log("multiplied", strength);

        return direction;

    }
});