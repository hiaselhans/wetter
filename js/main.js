//jQuery.noConflict();
"use strict";

+function($){

function StyleSheet(){
    this.rules = {}
}

StyleSheet.prototype.AddRule = function(selector, rules){
        if (!(selector in this.rules)){
            this.rules[selector] = {};
        }
        this.rules[selector] = $.extend(this.rules[selector], rules)
    };

StyleSheet.prototype.write = function(){

};


function PageSwitcher($pages, options){
    var DEFAULTS = {
        transition_time: 400,
        delay: 3000
    },
        _this = this;


    this.page_no = $pages.length;

    //set css fadein

    //set css active

    //set css fade_out

    this.in_a_transition = false;
    this.$pages = $pages;
    this.options = $.extend(DEFAULTS, options);
    this.current = 0;
    this.transitions = $pages.map(function GetTransitions() {
        var $page = $(this);
        $page.addClass('hidden'); // hide them all at the start
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
        return this.options['delay'];
    }
    return parseInt(delay, 10)
};

PageSwitcher.prototype.getTransitionTime = function($item){
    var time = $item.attr("transition-time");
    if (time == null) {
        return this.options['transition_time'];
    }
    return parseInt(time, 10);
};

PageSwitcher.prototype.getTransitionStyle = function(type, time, outfading) {
    var timeInSec = time / 1000;
    switch (type) {
        case 'swipe':
            var position = outfading ? "100%" : "-100%";
            var transition = "all " + timeInSec + "s";
            return {
                left: position,
                transition: transition,
                "z-index": "10" // the outfading one is in front of the new one
            };
            break;
        case 'fade':
            if (!outfading) {
                return {}
            }
            var transition = "all " + timeInSec + "s";
            return {
                opacity: "0",
                "transition": "all " + time + "s",
                "-webkit-transition": transition,
                "-moz-transition": transition,
                "z-index": "10" // the outfading one is in front of the new one
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

    if (delay < transitionTime) {
        console.log(delay, transitionTime, this);
        throw Error('Delay was ' + delay + ', transitionTime was ' +
        transitionTime)
    }

    console.log(transitionTime, delay);
    console.log(currentStyle, nextStyle);
    // the current has finished its transition, and all its transitionstyles
    // should have been overwritten by the active class
    // thus taking them away doesnt change anything. Also the new styles
    // should be all overwritten by the active class.
    $current.removeAttr('style').css(currentStyle);
    // the next is not active, and thus the nextStyle is not overwritten.
    // All transitions hide the box somewhere (opacity 0, left -100 or something)
    // So after applying them, we can savely remove the hidden class
    $next.removeAttr('style').css(nextStyle).removeClass('hidden');
    // $next.removeAttr('style').css(nextStyle);
    // no we set the right class to active and thereby start both css animations
    $current.removeClass('active');
    $next.addClass('active');
    // after this time, the animation has fully finished and the old current
    // is out of screen or something
    // we just hide it so the browser has a better time and can forget about them
    window.setTimeout(function() {
        $current.addClass('hidden');
    }, transitionTime);

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

    var delay = this.getDelay($next);
    ///this.transitions[transition]($current, $next);
    this.in_a_transition = false;
    this.current = next;
    window.setTimeout(jQuery.proxy(this.run, this), delay);
};



window.PageSwitcher = PageSwitcher;
}(jQuery);














