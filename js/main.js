
requirejs.config({
    baseUrl: "js",
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        "jquery": "vendor/jquery-1.10.2.min",
        "youtube": "https://www.youtube.com/iframe_api?noext",
        "PageSwitcher": "pageswitcher"
    },
    shim: {
        youtube: {
            exports: "YT"
        }

    }
});