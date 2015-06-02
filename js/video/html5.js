
define(["jquery"], function ($) {

    var video = function ($domElement) {
        this.$domElement = $domElement
    };

    video.prototype.prepare = function (on_ready) {
        this.$domElement.bind("ended", $.proxy(this._call_on_finish, this));
        this.$domElement.ready(on_ready);
    };

    video.prototype.play = function (on_finish) {
        if(on_finish != undefined){
            this.on_finish = on_finish;
        }
        this.$domElement[0].play();
    };

    video.prototype.pause = function () {
        this.$domElement[0].pause();
    };

    video.prototype._call_on_finish = function () {
        if (this.on_finish != undefined){
            this.on_finish();
        }
    };

    return video
});