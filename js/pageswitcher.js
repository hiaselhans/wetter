"use strict";

define(["jquery", "stylesheet", "transitions", "page"], function($, StyleSheet, Transitions, Page) {

    function PageSwitcher($pages, options) {
        var DEFAULTS = {
                transition_time: 400,
                delay: 3000
            },

            _this = this;

        this.page_no = $pages.length;
        this.$pages = $pages;
        this.options = $.extend(DEFAULTS, options);
        this.current = 0;
        this.styles = new StyleSheet();

        this.transitions = $pages.map(function GetTransitions(index, page) {
            var $page = $(page),
                page_identifier = "page_" + index;

            $page.addClass('in'); // hide them all at the start
            $page.addClass(page_identifier);
            return {
                type: $page.attr('data-transition'),
                time: _this.getTransitionTime($page),
                index: index
            };
        });
        this.transitions.map(function AddStyles(_, transition) {
            var index = transition.index;
            var next_index = (index + 1) % _this.transitions.length;

            //_this.styles.AddRule(".page.page_" + index,)
            _this.styles.addTransitionStyle(transition.type, transition.time, true, index);
            _this.styles.addTransitionStyle(transition.type, transition.time, false, next_index)
        });
        this.styles.write();

        this.pages = this.$pages.map(function () {
            return new Page($(this));
        });
    }

    PageSwitcher.prototype.prepareAll = function ($elem, on_finish) {
        var incomplete_page_num = 0;
        var finish_was_run = false; //never run on_finish twice
        // prepares everything, while filling $elem with a loading screen
        this.pages.map(function (_, page) {
            console.log(page);
            incomplete_page_num += 1;
            var $box = $('<div class="load-box incomplete"></div>');
            $elem.append($box);
            page.prepare(function () {
                console.log("something has finished", $box);
                $box.removeClass('incomplete').addClass('complete');
                incomplete_page_num -= 1;
                if (incomplete_page_num == 0 && !finish_was_run) {
                    finish_was_run = true;
                    on_finish();
                }
            })
        });
        if (incomplete_page_num == 0 && !finish_was_run) {
            finish_was_run = true;
            on_finish();
        }
    };

    PageSwitcher.prototype.getItem = function (index) {
        return this.$pages.eq(index)
    };

    PageSwitcher.prototype.getTransitionTime = function ($item) {
        var time = $item.attr("transition-time");
        if (time == null) {
            return this.options['transition_time'];
        }
        return parseInt(time, 10);
    };

    PageSwitcher.prototype.transition_finished = function (ev) {
        console.log("jo");
        var last = this.current - 1;
        if (last < 0) {
            last = this.page_no - 1
        }
        var $current = this.getItem(this.current),
            $last = this.getItem(last);
        $current.removeClass('in').addClass('out');
        $last.addClass('hidden');
        console.log("finishing", last, "/", this.current, ev);
        this.pages[this.current].show(jQuery.proxy(this.next, this))
    };

    PageSwitcher.prototype.next = function () {
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

    PageSwitcher.prototype.run = function () {
        this.next()
    };

    PageSwitcher.prototype.stop = function () {
        this.pages[this.current].pause();
    };


    return PageSwitcher

});