PP.HandPose = class HandPose {

    constructor(handedness) {
        this._mySession = null;
        this._myInputSource = null;

        this._myHandedness = handedness;

        this._myReferenceSpace = [0, 0, 0];

        this._myPosition = [0, 0, 0];
        this._myRotation = [0, 0, 0];

        this._myLinearVelocity = [0, 0, 0];
        this._myAngularVelocity = [0, 0, 0];
    }

    getReferenceSpace() {
        return this._myReferenceSpace;
    }

    getPosition() {
        return this._myPosition;
    }

    getRotation() {
        return this._myRotation;
    }

    getRotationQuaternion() {
        return null; //#TODO

    }

    getLinearVelocity() {
        return this._myLinearVelocity; //#TODO default when no linear velocity found

    }

    getAngularVelocity() {
        return this._myAngularVelocity; //#TODO default when no angular velocity found

    }

    start() {
        if (WL.xrSession) {
            this._setupVREvents(WL.xrSession);
        } else {
            WL.onXRSessionStart.push(this._setupVREvents.bind(this));
        }
    }

    update(dt) {
        let xrFrame = Module['webxr_frame'];
        if (xrFrame && this._myInputSource) {
            let xrPose = xrFrame.getPose(this._myInputSource.gripSpace, this._myReferenceSpace);

            if (xrPose) {
                this._myPosition[0] = xrPose.transform.position.x;
                this._myPosition[1] = xrPose.transform.position.y;
                this._myPosition[2] = xrPose.transform.position.z;

                this._myRotation[0] = xrPose.transform.orientation.x;
                this._myRotation[1] = xrPose.transform.orientation.y;
                this._myRotation[2] = xrPose.transform.orientation.z;

                if (xrPose.linearVelocity) {
                    this._myLinearVelocity[0] = xrPose.linearVelocity.x;
                    this._myLinearVelocity[1] = xrPose.linearVelocity.y;
                    this._myLinearVelocity[2] = xrPose.linearVelocity.z;
                } else {
                    this._myLinearVelocity[0] = 0;
                    this._myLinearVelocity[1] = 0;
                    this._myLinearVelocity[2] = 0;
                }

                if (xrPose.angularVelocity) {
                    this._myAngularVelocity[0] = xrPose.angularVelocity.x;
                    this._myAngularVelocity[1] = xrPose.angularVelocity.y;
                    this._myAngularVelocity[2] = xrPose.angularVelocity.z;
                } else {
                    this._myAngularVelocity[0] = 0;
                    this._myAngularVelocity[1] = 0;
                    this._myAngularVelocity[2] = 0;
                }
            } else {
                //keep previous position and rotation but reset velocity because reasons

                this._myAngularVelocity[0] = 0;
                this._myAngularVelocity[1] = 0;
                this._myAngularVelocity[2] = 0;

                this._myLinearVelocity[0] = 0;
                this._myLinearVelocity[1] = 0;
                this._myLinearVelocity[2] = 0;
            }
        }
    }

    _setupVREvents(session) {
        this._mySession = session;

        session.requestReferenceSpace('local').then(function (referenceSpace) { this._myReferenceSpace = referenceSpace; }.bind(this));

        this._mySession.addEventListener('end', function (event) {
            this._mySession = null;
            this._myInputSource = null;
        }.bind(this));

        this._mySession.addEventListener('inputsourceschange', function (event) {
            if (event.removed) {
                for (let item of event.removed) {
                    if (item == this._myInputSource) {
                        this._myInputSource = null;
                    }
                }
            }

            if (event.added) {
                for (let item of event.added) {
                    if (item.handedness == this._myHandedness) {
                        this._myInputSource = item;
                    }
                }
            }
        }.bind(this));
    }
};