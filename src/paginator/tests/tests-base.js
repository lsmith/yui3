YUI.add("paginator-base-tests", function(Y) {
    var ArrayAssert = Y.ArrayAssert,
        Assert = Y.Assert,
        ObjectAssert = Y.ObjectAssert,
        PB = Y.Base.create("paginator", Y.Base, [ Y.PaginatorBase ]);
    
    Y.namespace("Tests").PaginatorBase = new Y.Test.Case({
        name : "Y.PaginatorBase",
        
        //*
        "PaginatorBase should be instantiable" : function() {
            Assert.isInstanceOf(PB, new PB());
        },
        
        "PaginatorBase should validate page attribute" : function() {
            var pb = new PB();
            
            pb.set("page", -1);
            
            Assert.areEqual(1, pb.get("page"));
            
            pb.set("page", 0);
            
            Assert.areEqual(1, pb.get("page"));
            
            pb.set("page", 2);
            
            Assert.areEqual(1, pb.get("page"));
        },
        
        "PaginatorBase should validate offset attribute" : function() {
            var pb = new PB();
            
            pb.set("offset", -1);
            
            Assert.areEqual(0, pb.get("offset"));
            
            pb.set("offset", 1);
            
            Assert.areEqual(0, pb.get("offset"));
        },
        
        
        "PaginatorBase should calculate details on instantiation" : function() {
            new PB({
                after : {
                    detailsChange : function(e) {
                        var o = e.newVal;
                        
                        Assert.isObject(o);
                    }
                }
            });
        },
        
        "PaginatorBase should calculate sane defaults on basic instantiation" : function() {
            new PB({
                after : {
                    detailsChange : function(e) {
                        var o = e.newVal;
                        
                        Assert.areEqual(1, o.page);
                        Assert.areEqual(0, o.offset);
                        
                        Assert.isFalse(o.first);
                        Assert.isFalse(o.prev);
                        Assert.isFalse(o.next);
                        Assert.isFalse(o.last);
                        
                        ArrayAssert.isEmpty(o.pages);
                        ArrayAssert.isEmpty(o.offsets);
                    }
                }
            });
        },
        
        "PaginatorBase should calculate sane details on normal instantiation" : function() {
            new PB({
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
                        
                        ArrayAssert.itemsAreEqual([ 1, 2, 3, 4, 5 ], o.pages);
                        ArrayAssert.itemsAreEqual([ 0, 1, 2, 3, 4 ], o.offsets);
                    }
                }
            });
        },
        
        "PaginatorBase should calculate sane details with page specified" : function() {
            new PB({
                total : 5,
                page : 3,
                after : {
                    detailsChange : function(e) {
                        var o = e.newVal;
                        
                        Assert.areEqual(3, o.page);
                        Assert.areEqual(2, o.offset);
                        
                        Assert.areEqual(1, o.first);
                        Assert.areEqual(2, o.prev);
                        
                        Assert.areEqual(4, o.next);
                        Assert.areEqual(5, o.last);
                        
                        ArrayAssert.itemsAreEqual([ 1, 2, 3, 4, 5 ], o.pages);
                        ArrayAssert.itemsAreEqual([ 0, 1, 2, 3, 4 ], o.offsets);
                    }
                }
            });
        },
        
        "PaginatorBase should calculate sane details with even per" : function() {
            new PB({
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
                        
                        ArrayAssert.itemsAreEqual([ 1, 2, 3 ], o.pages);
                        ArrayAssert.itemsAreEqual([ 0, 2, 4 ], o.offsets);
                    }
                }
            });
        },
        //*/
        
        "PaginatorBase.increment should increment page" : function() {
            var pb = new PB({
                    total : 5,
                    per : 1
                });
            
            pb.increment();
            
            Assert.areEqual(2, pb.get("page"));
        },
        
        "PaginatorBase.increment should increment page a custom distance" : function() {
            var pb = new PB({
                    total : 5,
                    per : 1
                });
            
            pb.increment(2);
            
            Assert.areEqual(3, pb.get("page"));
        },
        
        "PaginatorBase.increment should not go past the end" : function() {
            var pb = new PB({
                    total : 5,
                    per : 1,
                    page : 5
                });
            
            pb.increment();
            
            Assert.areEqual(5, pb.get("page"));
        },
        
        "PaginatorBase.decrement should decrement page" : function() {
            var pb = new PB({
                    total : 5,
                    per : 1,
                    page : 5
                });
            
            pb.decrement();
            
            Assert.areEqual(4, pb.get("page"));
        },
        
        "PaginatorBase.decrement should decrement page a custom distance" : function() {
            var pb = new PB({
                    total : 5,
                    per : 1,
                    page : 5
                });
            
            pb.decrement(2);
            
            Assert.areEqual(3, pb.get("page"));
        },
        
        "PaginatorBase.decrement should not go past the beginning" : function() {
            var pb = new PB({
                    total : 5,
                    per : 1
                });
            
            Assert.areEqual(1, pb.get("page"));
            
            pb.decrement();
            
            Assert.areEqual(1, pb.get("page"));
        },
        
        "PaginatorBase.decrement should not go past the beginning" : function() {
            var pb = new PB({
                    total : 5,
                    per : 1
                });
            
            Assert.areEqual(1, pb.get("page"));
            
            pb.decrement(3);
            
            Assert.areEqual(1, pb.get("page"));
        }
    });

}, "@VERSION@", { requires : [ 
    "test", 
    "base-build", 
    "paginator-base" 
]});