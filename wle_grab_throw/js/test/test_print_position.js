WL.registerComponent('test-print-position', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        let position = [];
        this.object.getTranslationWorld(position);
        console.log(position.map(function (a) { return a.toFixed(4); }));
    },
});