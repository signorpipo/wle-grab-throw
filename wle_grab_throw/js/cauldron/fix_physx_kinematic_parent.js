WL.registerComponent('fix-physx-kinematic-parent', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        this.object.scalingWorld; //#BUG physx not updating and weird scaling without calling this getter (???)
    },
});