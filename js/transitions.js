

define([], function(){

    return {
        swipe: function (time, outfading) {
            var position = outfading ? "-100%" : "100%",
                transition = "all " + Seconds(time) + "s";
            return {
                left: position,
                transition: transition,
                "z-index": "10" // the outfading one is in front of the new one
            }
        },

        fade: function (time, outfading) {
            var transition = "all " + Seconds(time) + "s";

            if (!outfading) {
                return {
                    "opacity": "0",
                    "z-index": "10",
                    "transition": "all " + time + "s",
                    "-webkit-transition": transition,
                    "-moz-transition": transition,
                }
            } else {
                return {
                    opacity: "0.99",
                    "transition": "all " + time + "s",
                    "-webkit-transition": transition,
                    "-moz-transition": transition,
                    "z-index": "0" // the outfading one is in front of the new one
                }
            }
        },

        none: function (time, outfading) {
            return {
                transition: "none"
            }
        }
    }

});