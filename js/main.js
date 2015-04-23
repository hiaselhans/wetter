//jQuery.noConflict();
"use strict";

+function($){
    function PageSwitcher($pages, options){
        var DEFAULTS = {
            transition_time: 400,
            delay: 3000
        },

        _this = this;




        this.page_no = $pages.length;
        this.$pages = $pages;
        this.options = $.extend(DEFAULTS, options);
        this.current = 0;

        this.transitions = $pages.map(function GetTransitions(index) {
            var $page = $(this);
            var page_matcher = "page_" + index;
            $page.addClass('in'); // hide them all at the start
            $page.addClass(page_matcher);
            return {
                type: $page.attr('transition'),
                time: _this.getTransitionTime($page),
                index: index
            };
        });
        this.styles = new StyleSheet();
        this.transitions.map(function AddStyles(_, transition) {
            var index = transition.index;
            var next_index = (index + 1) % _this.transitions.length;
            console.log(transition);
            console.log(next_index);
            _this.styles.addTransitionStyle(transition.type, transition.time, true, index);
            _this.styles.addTransitionStyle(transition.type, transition.time, false, next_index)
        });
        this.styles.write();

        this.pages = this.$pages.map(function () {
            return new Page($(this));
        });
    }

    PageSwitcher.prototype.prepareAll = function (on_finish) {
        var _this = this,
            createCallback = function (index) {
                return function () {
                    if (index + 1 < _this.page_no) {
                        _this.pages[index + 1].prepare(createCallback(index + 1));
                    } else {
                        on_finish()
                    }
                }
            };
        this.pages[0].prepare(createCallback(0));
    };

    PageSwitcher.prototype.getItem = function(index){
        return this.$pages.eq(index)
    };

    PageSwitcher.prototype.getTransitionTime = function($item){
        var time = $item.attr("transition-time");
        if (time == null) {
            return this.options['transition_time'];
        }
        return parseInt(time, 10);
    };

    PageSwitcher.prototype.transition_finished = function () {
        var $current = this.getItem(this.current);
        $current.removeClass('in').addClass('out');
        var last = (this.current - 1) % this.page_no;
        this.getItem(last).addClass('hidden');
        this.pages[this.current].show(jQuery.proxy(this.next, this))
    };

    PageSwitcher.prototype.next = function() {
        var current = this.current,
            next = (current + 1) % this.page_no,
            next_next = (next + 1) % this.page_no;
        //console.log(current, next, this.page_no);
        var $current = this.getItem(current),
            $next = this.getItem(next),
            $next_next = this.getItem(next_next),
            transitionTime = this.transitions[next].time,
            delay = this.transitions[next].delay;

        if (delay < transitionTime) {
            console.log(delay, transitionTime, this);
            throw Error('Delay was ' + delay + ', transitionTime was ' +
                transitionTime)
        }
        //first, we prepare the one after
        $next_next.addClass('in').removeClass('out').removeClass('hidden');
        var trans_finish_func = jQuery.proxy(this.transition_finished, this);
        $next.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", trans_finish_func);
        $current.removeClass('active');
        this.current = next;
        $next.addClass('active');
        //trans_finish_func()
    };

    PageSwitcher.prototype.run = function(){
        //if (!this.$pages.find(".active")){
        //    this.pages[0].show()
        //}
        this.next()
    };

    PageSwitcher.prototype.stop = function () {
        this.pages[this.current].pause();
    };


    window.PageSwitcher = PageSwitcher;
}(jQuery);














