"use strict";

define(["jquery", "youtube"], function($, YT){

    function addBust(url){
        var bust = "bust=" + new Date().getTime();
        if (url.match(/(.*)bust=[0-9]*(.*)/)){
            return url.replace(/bust=[0-9]*/, bust);
        } else {
            if (url.match(/.*?.*=.*/)) {
                return url + "&" + bust;
            }
                return url + "?" + bust;
        }
    }

    function Page($elem) {
        this.$element = $elem;
        var youtube_page = $elem.find(".youtube");

        if (!youtube_page.length) {
            this.time = $elem.attr("data-time") || 100;
            this.is_youtube = false;
        } else {
            this.is_youtube = true;
        }
    }

    Page.prototype.show = function(on_finish) {
        // Call on_finish after the page timeout has passed....

        // chromium fires both actions
        /*if (this.active){
            console.log("aha, double");
            return;
        }
        var _this = this;
        this.active = true;
        this.on_finish = function () {
            _this.active = false;
            on_finish();
        };*/
        var finish_fct = $.proxy(this._call_on_finish, this);
        this.on_finish = on_finish;
        if (this.is_youtube) {
            this.player.playVideo();
        } else {
            this.timeout = window.setTimeout(finish_fct, this.time);
        }
    };

    Page.prototype._call_on_finish = function() {
        console.log("aye");
        if (this.on_finish != undefined) {
            this.on_finish()
        }
        this.on_finish = undefined;
    };

    Page.prototype.pause = function () {
        if (this.is_youtube) {
            this.player.pauseVideo();
        } else {
            window.clearTimeout(this.timeout);
        }
    };

    Page.prototype.continue = function () {
        this.show(this.on_finish);
    };

    Page.prototype.prepare = function (on_ready) {
        var incomplete_elements = 1,  //one "shadow element"
            _this = this;
        var one_elem_complete = function () {
            incomplete_elements -= 1;
            if (incomplete_elements == 0) {
                on_ready()
            }
        };
        if (this.is_youtube) {
            incomplete_elements += 1;
            this.prepare_youtube(one_elem_complete);
        }
        this.$element.find('img').map(function (index, img) {
            incomplete_elements += 1;
            $(img).load(one_elem_complete);
        });
        this.$element.find('iframe').map(function (index, img) {
            incomplete_elements += 1;
            $(img).load(one_elem_complete);
        });
        this.$element.find(".resource").map(function(index, div){
            incomplete_elements += 1;
            _this.fetch_resource(div, one_elem_complete);
        });
        one_elem_complete();
        //after a timeout, I'm finished
        window.setTimeout(function () {
            if (incomplete_elements != 0) {
                on_ready();
                incomplete_elements = -1;
            }
        }, 5000)
    };

    Page.prototype.reload = function(on_ready){
        // IMAGES
        this.$element.find("img").each(function(index, img){
            // create a copy and pre-fetch a new image
            var $img = $(img),
                $new_img = $img.clone(),
                new_url = addBust($img.attr("src"));
            $new_img.attr("src", new_url);

            // replace the original's url once our copy has finished loading
            $new_img.load(function(event){
                $img.attr("src", new_url);
            })
        });

        // FETCHES
    };

    Page.prototype.fetch_resource = function(div, on_ready) {
        var $resource = $(div),
            url = $resource.attr("data-src"),
            node = $resource.attr("data-node"),
            $iframe = $("<iframe></iframe>"),
            $head = $("body");

        $iframe.attr("src", url);

        $iframe.load(function (ev) {
            var found = $iframe.contents().find(node);

            if (found){
                // todo: prefix content urls
                $resource.append(found);
            } else {
                $resource.append($iframe);
            }
            on_ready();
        });


        $head.append($iframe);
        //$head.remove($iframe);

        console.log("yo fetche " + url);



    };

    Page.prototype.prepare_youtube = function (on_ready) {
        var _this = this,
            domElement = _this.$element.find(".youtube").get(0);
        YT.ready(function () {
            _this.player = new YT.Player(domElement, {
                //height: '390',
                //width: '640',
                playerVars: {
                    controls: 0
                    //autohide: 1
                },
                videoId: $(domElement).attr('data-id'),
                events: {
                    'onReady': on_ready,
                    'onStateChange': onPlayerStateChange
                }
            });
        });


        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.ENDED) {
                _this._call_on_finish();
            }
        }
    };

    return Page;

});