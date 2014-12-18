jQuery.noConflict();


+function($){
function PageSwitcher($pages, options){
    var DEFAULTS = {
        transition_time: 400,
        delay: 3000
    },
        _this = this;

    $pages.each(function(i, item){
            //set an id if not present

            //set css next (fade_in)

            //set css active

            //set css last (fade_out)
        }
    );

    this.in_a_transition = false;
    this.$pages = $pages;
    this.options = $.extend(DEFAULTS, options);
    this.current = 0;
    this.page_no = $pages.length;
    this.transitions = $pages.map(function GetTransitions() {
        var $page = $(this);
        return {
            type: $page.attr('transition'),
            time: _this.getTransitionTime($page),
            delay: _this.getDelay($page)
        };
    });

    this.styles = this.transitions.map(function GetStyles(i, trans) {
        var next_trans = _this.transitions[(i + 1) % _this.transitions.length];
        console.log(trans);
        console.log(next_trans, trans.time);
        console.log(_this.getTransitionStyle(trans.type, trans.time, true));
        return {
            before: _this.getTransitionStyle(trans.type, trans.time, false),
            after: _this.getTransitionStyle(next_trans.type, next_trans.time, true)
        }
    });

}

PageSwitcher.prototype.getItem = function(index){
    return this.$pages.eq(index)
};

PageSwitcher.prototype.getDelay = function($item){
    var delay = $item.attr("time");
    if (delay == null) {
        delay = this.options['delay'];
    }
    return delay
};

PageSwitcher.prototype.getTransitionTime = function($item){
    var time = $item.attr("transition_time");
    if (time == null) {
        time = this.options['transition_time'];
    }
    return time
};

PageSwitcher.prototype.getTransitionStyle = function(type, time, outfading) {
    var halfTime = time / 2 / 1000; // use half the time for fading in, half for fading out
    switch (type) {
        case 'swipe':
            var position = outfading ? "100%" : "-100%";
            var transition = "position " + halfTime + "s";
            return {
                position: position,
                transition: transition
            };
            break;
        case 'fade':
            var transition = "opacity " + halfTime + "s";
            return {
                //opacity: "1",
                "transition": transition,
                "-webkit-transition": transition,
                "-moz-transition": transition
            };
            break;
        default:
            throw Error("unknown transition " + type);
    }
};

PageSwitcher.prototype.next = function() {
    var current = this.current,
        next = (current + 1) % this.page_no;

    console.log(current, next, this.page_no);
    var $current = this.getItem(current),
        $next = this.getItem(next),
        currentStyle = this.styles[current].after,
        nextStyle = this.styles[next].before,
        transitionTime = this.transitions[next].time,
        delay = this.transitions[next].delay;

    console.log(currentStyle, nextStyle);
    $current.removeAttr('style').css(currentStyle);
    $next.removeAttr('style').css(nextStyle);
    $current.removeClass('active');
    $next.addClass('active');
    window.setTimeout(function() {
        $current.removeAttr('style');
    }, transitionTime/2);

    //delay=300;
    //console.log(current, next, this.page_no, transitionTime, nextDelay);
    this.current = next;
    //this.next();
    window.setTimeout(jQuery.proxy(this.next, this), delay)
};

PageSwitcher.prototype.run = function(){
    if (this.in_a_transition){
        return null;
    }
    this.in_a_transition = true;


    var current = this.current,
        next = current + 1;

    if (next >= this.page_no){
        next = 0;
    }

    var $current = this.getItem(this.current),
        $next = this.getItem(next),
        transition = $next.attr("transition");

    if (!(transition in this.transitions)){
        transition = "none"
    }

    delay = this.getDelay($next);
    ///this.transitions[transition]($current, $next);
    this.in_a_transition = false;
    this.current = next;
    window.setTimeout(jQuery.proxy(this.run, this), delay);
};



window.PageSwitcher = PageSwitcher;
}(jQuery);














