
define(["jquery", "youtube"], function ($, YT) {

    var youtube_video = function ($domelement) {
        this.$domElement = $domelement;
    };

    youtube_video.prototype.prepare = function (on_ready) {
        var self = this;
        console.log("dom", self.$domElement);

        YT.ready(function () {
            self.player = new YT.Player(self.$domElement[0], {
                //height: '390',
                //width: '640',
                playerVars: {
                    controls: 0
                    //autohide: 1
                },
                videoId: self.$domElement.attr('data-id'),
                events: {
                    'onReady': on_ready,
                    'onStateChange': $.proxy(self._call_on_finish, self)
                }
            });
        });
    };

    youtube_video.prototype.play = function (on_finish) {
        if (on_finish != undefined){
            this.on_finish = on_finish
        }
        this.player.playVideo();
    };

    youtube_video.prototype.pause = function () {
        this.player.pauseVideo();

    };

    youtube_video.prototype._call_on_finish = function (evt) {
        if (this.on_finish != undefined && evt.data == YT.PlayerState.ENDED){
            this.on_finish();
        }
    };

    return youtube_video

});