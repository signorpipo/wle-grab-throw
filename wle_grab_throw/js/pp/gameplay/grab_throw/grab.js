WL.registerComponent('grab', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myCollider: { type: WL.Type.Object }
}, {
    init: function () {
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Thres", 3, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Damp", 1, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Max", 15, 1, 4));

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

        this._myThrowLinearStrengthMinThreshold = 2;
        this._myThrowLinearStrengthMaxThreshold = 3;
        this._myThrowLinearStrengthExtraPercentage = 1;
        this._myThrowLinearMaxStrength = 15;

        this._myThrowAngularStrengthDampingThreshold = 15;
        this._myThrowAngularStrengthDamping = 0.1;
        this._myThrowAngularMaxStrength = 23;

    },
    start: function () {
    },
    update: function (dt) {
        this._myThrowLinearStrengthMaxThreshold = PP.EasyTuneVariables.get("Thres").myValue;
        this._myThrowLinearStrengthExtraPercentage = PP.EasyTuneVariables.get("Damp").myValue;
        this._myThrowLinearMaxStrength = PP.EasyTuneVariables.get("Max").myValue;

        if (this._myGrabbed) {
            this._updateVelocityHistory();
        }
    },
    _grabStart: function (e) {
        if (!this._myGrabbed) {
            let collidingComps = this._myColliderComponent.queryOverlaps();
            for (let i = 0; i < collidingComps.length; i++) {
                let grabbable = collidingComps[i].object.getComponent("grabbable");
                if (grabbable && !grabbable.myIsGrabbed) {
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
            let linearVelocity = this._computeReleaseLinearVelocity();
            let angularVelocity = this._computeReleaseAngularVelocity();

            this._myGrabbed.release(linearVelocity, angularVelocity);
            this._myGrabbed = null;
        }
    },
    _updateVelocityHistory() {
        this._myHistoryCurrentCount++;

        this._myGrabbedLinearVelocityHistory.unshift(this._myGrabbed.myPhysx.linearVelocity.slice(0));
        this._myGrabbedLinearVelocityHistory.pop();
    },
    _computeReleaseLinearVelocity() {
        if (this._myHistoryCurrentCount < this._myHistorySize) {
            return this._myGrabbed.myPhysx.linearVelocity;
        }

        //strength
        let strength = glMatrix.vec3.length(this._myGrabbedLinearVelocityHistory[0]);
        //let strength2 = glMatrix.vec3.length(this._myGrabbedLinearVelocityHistory[0]);
        for (let i = 1; i < this._myHistoryStrengthAverageFromStart; i++) {
            strength += glMatrix.vec3.length(this._myGrabbedLinearVelocityHistory[i]);
        }
        strength /= this._myHistoryStrengthAverageFromStart;
        //console.log(this._myGrabbedLinearVelocityHistory.slice(0, this._myHistoryStrengthAverageFromStart).map(function (a) { return glMatrix.vec3.length(a); }));
        //console.log(strength2, " - ", strength);

        let strengthMultiplierIntensity = (strength - this._myThrowLinearStrengthMinThreshold) / (this._myThrowLinearStrengthMaxThreshold - this._myThrowLinearStrengthMinThreshold); //linear equation
        strengthMultiplierIntensity = Math.min(1, Math.max(0, strengthMultiplierIntensity));

        strength += strength * this._myThrowLinearStrengthExtraPercentage * strengthMultiplierIntensity;
        strength = Math.min(strength, this._myThrowLinearMaxStrength);

        //console.log(strength2, " - ", strength);
        //console.log(strength.toFixed(4));

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

        glMatrix.vec3.scale(direction, direction, strength);

        return direction;
    },
    _computeReleaseAngularVelocity() {
        //strength
        let strength = glMatrix.vec3.length(this._myGrabbed.myPhysx.angularVelocity);
        //let strength2 = glMatrix.vec3.length(this._myGrabbed.myPhysx.angularVelocity);

        if (strength > this._myThrowAngularStrengthDampingThreshold) {
            strength = this._myThrowAngularStrengthDampingThreshold + (strength - this._myThrowAngularStrengthDampingThreshold) * this._myThrowAngularStrengthDamping;
        }

        strength = Math.min(strength, this._myThrowAngularMaxStrength);

        //console.log(strength2, " - ", strength);
        //console.log(strength.toFixed(4));

        //direction
        let direction = this._myGrabbed.myPhysx.angularVelocity.slice(0);
        glMatrix.vec3.normalize(direction, direction);

        glMatrix.vec3.scale(direction, direction, strength);

        return direction;
    }
});