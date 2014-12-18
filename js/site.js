/**
 * Created by simon on 18.12.14.
 */
function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}



jQuery(document).ready(function($) {


    //TODO: vorfetchen, iterieren,

    $myp=$('#websat');
    $myp.removeAttr('id');
//$myp.remove();
    for (var i= 1; i<=24; i++){
        new_p = $myp.clone();
        new_p.children('img').attr('src', "http://file.wetter.at/mowis/animationen/websat_"+FormatNumberLength(i,2)+".jpg");
        //console.log(new_p.html());
        new_p.insertAfter($myp);
    }


    var $pages = $('.page'),
        pageswitcher = new PageSwitcher($pages, {delay: 5000});

    if ($('.page.active').length == 0) {
        pageswitcher.next();
    }



});