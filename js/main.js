jQuery.noConflict();


+function($){
function PageSwitcher($pages, options){
    DEFAULTS = {transition_time: 200,
                delay: 3000};

    this.in_a_transition = false;
    this.$pages = $pages;
    this.options = jQuery.extend(DEFAULTS, options);
    this.current = 0;
    this.page_no = $pages.length;
    this.transitions =
        {none: function($current_item, $next, transition_time){
            $next.addClass('active');
            $current_item.removeClass('active');
        },
        fade: function($current, $next, transition_time){
            $current.fadeOut(transition_time, function() {$current.removeClass('active')});
            $next.fadeIn(transition_time, function (){$next.addClass('active')});
        }};
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
    var time = $item.attr("time");
    if (delay == null) {
        delay = this.options['transition_time'];
    }
    return delay
};

PageSwitcher.prototype.next = function() {

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
    this.transitions[transition]($current, $next);
    this.in_a_transition = false;
    this.current = next;
    window.setTimeout(jQuery.proxy(this.run, this), delay);
};
function Iterator(item){
    $item = $(item);
    to_iterate = $item.attr('for').split(",");
    if (to_iterate.length == 2) {

    }
    console.log(jQuery(this).html(), item, this);
}



window.PageSwitcher = PageSwitcher;
}(jQuery);














