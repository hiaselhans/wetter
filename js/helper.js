
define(["jquery"], function($){
    function call (funcs){
        if (funcs == undefined){
            return
        } else if ($.isArray(funcs)){
            return $.apply(function(func){
                        call(func);
                    }, funcs);
        } else if ($.isFunction(funcs)){
            return funcs()
        }
    }

});