YUI.add("paginator-widget-tests", function(Y) {
    
    Y.namespace("Tests").Paginator = new Y.Test.Case({
        name : "Y.Paginator",
        
        "this test should run" : function() {
            var p = new Y.Paginator({
                    total : 5,
                    render : true
                });
        }
    });

}, "@VERSION@", { requires : [
    "test",
    "base-build",
    "paginator"
]});