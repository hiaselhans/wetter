+function($){
    "use strict";

    function Page($elem) {
        this.$element = $elem;
        var youtube_page = $elem.find(".youtube");
        console.log(youtube_page);
        if (!youtube_page.length) {
            this.time = $elem.attr("data-time") || 100;
            this.is_youtube = false;
        } else {
            this.is_youtube = true;
        }
    }

    Page.prototype.show = function(on_finish) {
        this.on_finish = on_finish;
        if (this.is_youtube) {
            this.player.playVideo();
        } else {
            this.timeout = window.setTimeout(on_finish, this.time);
        }
    };

    Page.prototype.pause = function () {
        if (this.is_youtube) {
            this.paused = true;
            this.player.pauseVideo();
        } else {
            window.clearTimeout(this.timeout);
        }
    };

    Page.prototype.continue = function () {
        this.show(this.on_finish);
    };

    Page.prototype.prepare = function (on_finish) {
        if (this.is_youtube) {
            this.prepare_youtube(on_finish)
        } else {
            on_finish()
        }
    };

    Page.prototype.prepare_youtube = function (on_finish) {
        var _this = this;
        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";


        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        window.onYouTubeIframeAPIReady = function() {
            _this.player = new YT.Player(_this.$element.find(".youtube").get(0), {
                height: '390',
                width: '640',
                playerVars: {
                    controls: 0,
                    //autohide: 1
                },
                videoId: _this.$element.find(".youtube").attr('data-id'),
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
            on_finish();
        };


        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.ENDED) {
                _this.on_finish();
            }
        }
    };

    window.Page = Page;
}(jQuery);