YUI.add("paginator-core-tests", function(Y) {
    var Assert = Y.Assert,
        ObjectAssert = Y.ObjectAssert,
        Paginator = Y.Base.create("paginator", Y.Base, [ Y.Paginator.Core ]);
    
    Y.namespace("Tests").Core = new Y.Test.Case({
        name : "Y.Core",
        
        "Core should be instantiable" : function() {
            Assert.isInstanceOf(Paginator, new Paginator());
        },
        
        "Core should refuse invalid page attribute" : function() {
            var p = new Paginator();
            
            Assert.isUndefined(p.get("page"));
            
            p.set("page", -1);
            
            Assert.isUndefined(p.get("page"));
            
            p.set("page", 0);
            
            Assert.isUndefined(p.get("page"));
            
            p.set("page", 2);
            
            Assert.isUndefined(p.get("page"));
        },
        
        "Core should accept page attributes > 1 when total is Infinity" : function() {
            var pi = new Paginator({ total : "Infinity" });
            
            Assert.areEqual(1, pi.get("page"));
            
            pi.set("page", -1);
            
            Assert.areEqual(1, pi.get("page"));
            
            pi.set("page", 0);
            
            Assert.areEqual(1, pi.get("page"));
            
            pi.set("page", 200);
            
            Assert.areEqual(200, pi.get("page"));
        },
        
        "Core should validate offset attribute" : function() {
            var p = new Paginator();
            
            p.set("offset", -1);
            
            Assert.areEqual(0, p.get("offset"));
            
            p.set("offset", 1);
            
            Assert.areEqual(0, p.get("offset"));
        },
        
        "Core should calculate details on instantiation" : function() {
            new Paginator({
                after : {
                    detailsChange : function(e) {
                        var o = e.newVal;
                        
                        Assert.isObject(o);
                    }
                }
            });
        },
        
        "Core should calculate sane defaults on basic instantiation" : function() {
            new Paginator({
                after : {
                    detailsChange : function(e) {
                        var o = e.newVal;
                        
                        Assert.isUndefined(o.page);
                        Assert.areEqual(0, o.offset);
                        
                        Assert.isFalse(o.first);
                        Assert.isFalse(o.prev);
                        Assert.isFalse(o.next);
                        Assert.isFalse(o.last);
                    }
                }
            });
        },
        
       "Core should calculate sane details on normal instantiation" : function() {
            new Paginator({
                total : 5,
                after : {
                    detailsChange : function(e) {
                        var o = e.newVal;
                        
                        Assert.areEqual(1, o.page);
                        Assert.areEqual(0, o.offset);
                        
                        Assert.isFalse(o.first);
                        Assert.isFalse(o.prev);
                        
                        Assert.areEqual(2, o.next);
                        Assert.areEqual(5, o.last);
                    }
                }
            });
        },
        
        "Core should calculate sane details with page specified" : function() {
            new Paginator({
                total : 5,
                page : 3,
                after : {
                    detailsChange : function(e) {
                        var o = e.newVal;
                        
                        console.log(o); //TODO: REMOVE DEBUGGING
                        
                        Assert.areEqual(3, o.page);
                        Assert.areEqual(2, o.offset);
                        
                        Assert.areEqual(1, o.first);
                        Assert.areEqual(2, o.prev);
                        
                        Assert.areEqual(4, o.next);
                        Assert.areEqual(5, o.last);
                    }
                }
            });
        },
        
        "Core should calculate sane details with even per" : function() {
            new Paginator({
                total : 5,
                per : 2,
                after : {
                    detailsChange : function(e) {
                        var o = e.newVal;
                        
                        Assert.areEqual(1, o.page);
                        Assert.areEqual(0, o.offset);
                        
                        Assert.isFalse(o.first);
                        Assert.isFalse(o.prev);
                        
                        Assert.areEqual(2, o.next);
                        Assert.areEqual(3, o.last);
                    }
                }
            });
        },
        
        "Core.increment should increment page" : function() {
            var p = new Paginator({
                    total : 5
                });
            
            p.increment();
            
            Assert.areEqual(2, p.get("page"));
        },
        
        "Core.increment should increment page a custom distance" : function() {
            var p = new Paginator({
                    total : 5
                });
            
            p.increment(2);
            
            Assert.areEqual(3, p.get("page"));
        },
        
        "Core.increment should not go past the end" : function() {
            var p = new Paginator({
                    total : 5,
                    page : 5
                });
            
            p.increment();
            
            Assert.areEqual(5, p.get("page"));
        },
        
        "Core.decrement should decrement page" : function() {
            var p = new Paginator({
                    total : 5,
                    page : 5
                });
            
            p.decrement();
            
            Assert.areEqual(4, p.get("page"));
        },
        
        "Core.decrement should decrement page a custom distance" : function() {
            var p = new Paginator({
                    total : 5,
                    page : 5
                });
            
            p.decrement(2);
            
            Assert.areEqual(3, p.get("page"));
        },
        
        "Core.decrement should not go past the beginning" : function() {
            var p = new Paginator({
                    total : 5
                });
            
            Assert.areEqual(1, p.get("page"));
            
            p.decrement();
            
            Assert.areEqual(1, p.get("page"));
        },
        
        "Core.first should update page & offset correctly" : function() {
            var p = new Paginator({
                    total : 10
                }),
                p2 = new Paginator();
            
            p.first();
            
            Assert.areEqual(1, p.get("page"));
            Assert.areEqual(0, p.get("offset"));
            
            p2.first();
            
            Assert.isUndefined(p.get("page"));
            Assert.areEqual(0, p.get("offset"));
        },
        
        "Core.last should update page & offset correctly" : function() {
            var p = new Paginator({
                    total : 10
                }),
                p2 = new Paginator({
                    total : 12,
                    per : 3
                }),
                p3 = new Paginator({
                    total : "Infinity"
                }),
                p4 = new Paginator();
            
            p.last();
            
            Assert.areEqual(10, p.get("page"));
            Assert.areEqual(9, p.get("offset"));
            
            p2.last();
            
            Assert.areEqual(4, p2.get("page"));
            Assert.areEqual(9, p.get("offset"));
            
            p3.last();
            
            Assert.isUndefined(p3.get("page"));
            Assert.areEqual("Infinity", p3.get("offset"));
            
            p4.last();
            
            Assert.isUndefined(p4.get("page"));
            Assert.areEqual(0, p4.get("offset"));
        }
    });

}, "@VERSION@", { requires : [
    "test",
    "base-build",
    "paginator-core"
]});
