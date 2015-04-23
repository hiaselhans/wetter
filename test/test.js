jQuery(document).ready(function($) {
    QUnit.test( "styler reftest", function( assert ) {
        var styler = new StyleSheet();
        styler.AddRule("#my_id.my_class", {"my_prop": "hidden !important"});
        assert.ok( styler.compile() == "#my_id.my_class {\n\tmy_prop: hidden !important;\n}\n" );
    });
});