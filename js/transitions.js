

define([], function(){

    function Seconds(time) {
        return time/1000
    }

    return {
        swipe: function (time, out) {
            var position = out ? "-100%" : "100%",
                transition = "all " + Seconds(time) + "s";
            return {
                left: position,
                transition: transition,
                "z-index": "10" // the out one is in front of the new one
            }
        },

        fade: function (time, out) {
            var transition = "all " + Seconds(time) + "s";

            if (!out) {
                return {
                    "opacity": "0",
                    "z-index": "10",
                    "transition": transition,
                    "-webkit-transition": transition,
                    "-moz-transition": transition,
                }
            } else {
                return {
                    opacity: "0.99",
                    "transition": transition,
                    "-webkit-transition": transition,
                    "-moz-transition": transition,
                    "z-index": "0" // the out one is in front of the new one
                }
            }
        },

        none: function (time, out) {
            return {
                transition: "none"
            }
        }
    }

});