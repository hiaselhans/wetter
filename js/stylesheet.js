"use strict";
/*
* Class to define css-rules and append them to the head of the document
* */
define(["jquery"], function(){
    // whatabout Nested stylesheets?

    function StyleSheet(rules) {
        this.rules = rules || {};
        this.$domElement = false;
    }

    StyleSheet.prototype.AddRule = function(selector, rules){
        if (!(selector in this.rules)){
            this.rules[selector] = {};
        }
        this.rules[selector] = $.extend(this.rules[selector], rules)
        return this;
    };

    StyleSheet.prototype.write = function() {
        if (this.$domElement == false){
            this.$domElement = document.createElement('style');
            this.$domElement.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(this.$domElement);
        }
        this.$domElement.innerHTML = this.compile();
        return this.$domElement;
    };


    StyleSheet.prototype.addTransitionStyle = function(type, time, outfading, id) {
        var timeInSec = time / 1000;
        var selector = ".page.page_" + id + "." + (outfading ? "out" : "in");
        var style, transition;
        switch (type) {
            case 'swipe':
                var position = outfading ? "-100%" : "100%";
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
            case "none":
                style = {};
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


    return StyleSheet


});