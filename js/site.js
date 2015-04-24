
require(["main", "jquery", "pageswitcher"], function (_, $, PageSwitcher) {

    function FormatNumberLength(num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }
    console.log("JO");
    $(document).ready(function ($) {


        //TODO: vorfetchen, iterieren,

        $myp = $('#websat');
        $myp.removeAttr('id');

        for (var i = 1; i <= 24; i++) {
            new_p = $myp.clone();
            new_p.children('img').attr('src', "http://file.wetter.at/mowis/animationen/websat_" + FormatNumberLength(i, 2) + ".jpg");
            new_p.insertAfter($myp);
        }


        var $pages = $('.page'),
            pageswitcher = new PageSwitcher($pages, {delay: 5000}),
            $load_screen = $('#loading_screen');

        $(".controls .pause").on("click", function(){
            pageswitcher.stop()
        });
        $(".controls .play").on("click", function(){
            pageswitcher.run()
        });

        $(".controls .next").on("click", function(){
            pageswitcher.next()
        });


        window.pageswitcher = pageswitcher;
        pageswitcher.prepareAll($load_screen, function () {
            $load_screen.hide();
            //needs to wait a bit, otherwise transition events get funky
            pageswitcher.run();
            //setTimeout(function () {
            //    pageswitcher.run()
            //}, 100);
        });


    });

});