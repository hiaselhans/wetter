// Youtube js file randomly adds YT.Player some time later
// loading the js files synchronously simply fails as "YT.Player is undefined"
// using requirejs requires a plugin

+function () {
    var youtube_queue = [];
    window.onYouTubeIframeAPIReady = function () {
        youtube_queue.map(function (func) {
            func();
        })
    };
    window.call_on_YT_ready = function (callback) {
        if (window.YT == undefined || window.YT.Player == undefined) {
            youtube_queue.push(callback);
        } else {
            callback();
        }
    }
} ();