
+function($){
    "use strict";


    function StyleSheet() {
        this.rules = {}
    }

    StyleSheet.prototype.AddRule = function(selector, rules){
        if (!(selector in this.rules)){
            this.rules[selector] = {};
        }
        this.rules[selector] = $.extend(this.rules[selector], rules)
    };

    StyleSheet.prototype.write = function() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = this.compile();
        document.getElementsByTagName('head')[0].appendChild(style);
        return style;
    };


    StyleSheet.prototype.addTransitionStyle = function(type, time, outfading, id) {
        var timeInSec = time / 1000;
        var selector = ".page.page_" + id + "." + (outfading ? "out" : "in");
        var style, transition;
        switch (type) {
            case 'swipe':
                var position = outfading ? "100%" : "-100%";
                transition = "all " + timeInSec + "s";
                style = {
                    left: position,
                    transition: transition,
                    "z-index": "10" // the outfading one is in front of the new one
                };
                break;
            case 'fade':
                transition = "all " + timeInSec + "s";
                if (!outfading) {
                    style = {
                        "opacity": "0",
                        "z-index": "10",
                        "transition": "all " + time + "s",
                        "-webkit-transition": transition,
                        "-moz-transition": transition,
                    };
                    break;
                }
                style = {
                    opacity: "0.99",
                    "transition": "all " + time + "s",
                    "-webkit-transition": transition,
                    "-moz-transition": transition,
                    "z-index": "0" // the outfading one is in front of the new one
                };
                break;
            default:
                throw new Error("unknown transition " + type);
        }
        this.AddRule(selector, style);
    };

    StyleSheet.prototype.compile = function () {
        var sheet = "";
        var selector, rule;
        for (selector in this.rules) {
            if (!this.rules.hasOwnProperty(selector)) {
                continue
            }
            sheet += selector + " {\n";
            for (rule in this.rules[selector]) {
                if (!this.rules[selector].hasOwnProperty(rule)) {
                    continue
                }
                sheet += "\t" + rule + ": " + this.rules[selector][rule] + ";\n"
            }
            sheet += "}\n";
        }
        return sheet;
    };

    window.StyleSheet = StyleSheet;
}(jQuery);