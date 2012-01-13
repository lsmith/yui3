    //aliases
var L = Y.Lang,
    INVALID_VALUE = Y.Attribute.INVALID_VALUE,
    YAindexOf = Y.Array.indexOf,
    ceil = Math.ceil,
    floor = Math.floor,
    
    //helpers
    parse = function(value) {
        var v = parseInt(value, 10);
        
        return !isNaN(v) ? v : null;
    },
    
    //placeholders
    Core;

Core = function() {};

Core.ATTRS = {
    total : {
        value : 0,
        setter : "_setTotal"
    },
    
    per : {
        value : 1,
        setter : "_setPer"
    },
    
    offset : {
        value : 0,
        setter : "_setOffset"
    },

    page : {
        setter : "_setPage"
    },
    
    details : {
        value : {}
    }
};

Y.mix(Core.prototype, {
    
    //lifetime
    initializer : function() {
        this._handlers = this.after([
            "perChange",
            "totalChange",
            "offsetChange",
            "pageChange"
        ], this._update, this);
        
        this._update();
    },
    
    destructor : function() {
        this._handlers.detach();
        this._handlers = null;
    },
    
    //Public API
    increment : function(step) {
        var s = parse(step) || 1;
        
        this.set("page", this.get("page") + s);
    },
    
    decrement : function(step) {
        var s = parse(step) || 1;
        
        this.set("page", this.get("page") - s);
    },
    
    first : function() {
        //TODO: implement
    },
    
    last : function() {
        //TODO: implement
    },
    
    //Private
    _update : function(e) {
        //short-circuit internal updates
        if(e && e.internal) {
            return;
        }
        
        var o = this.getAttrs([ "per", "total", "offset", "page" ]),
            max = (o.total === "Infinity") ? "Infinity" : ceil(o.total / o.per),
            source = { internal : true },
            offset, first, prev, current, next, last;
        
        //sanity checks
        isNaN(max) && (max = 0);
        
        if(e && e.attrName === "offset") {
            offset = o.offset
        } else {
            offset = o.page < 2 ? 0 : (o.page - 1 || 0) * o.per;
        }
        current = Math.floor((offset / o.per) + 1 || 1);
        
        next = current + 1;
        (next > max) && (next = false);
        
        prev = current - 1;
        (prev < 1) && (prev = false);

        first = prev && 1;
        last  = next && max;
        
        //sanity check current as a final step
        (current * o.per > max) && (current = o.page);
        
        //update attributes w/ what we calculated
        this.set("details", {
            page    : current,
            offset  : offset,
            
            first   : first,
            prev    : prev,
            next    : next,
            last    : last
        });
        
        (current !== o.page)  && this.set("page", current, source);
        (offset !== o.offset) && this.set("offset", offset, source);
    },
    
    //Attribute-related fns
    _setPer : function(value) {
        var per = parse(value);

        return per > 0 ? per : INVALID_VALUE;
    },
    
    _setTotal : function(value) {
        //shortcut "Infinity" case
        if(value === "Infinity") {
            return value;
        }
        
        var total = parse(value);
        
        return total >= 0 ? total : INVALID_VALUE;
    },

    _setPage : function(value) {
        var max = ceil(this.get("total") / this.get("per")),
            page = parse(value);
        
        max = (max === "Infinity") ? true : page <= max;
        
        return (page > 0 && max) ? page : INVALID_VALUE;
    },

    _setOffset : function(value) {
        var total = this.get("total"),
            offset = parse(value);
        
        total = (total === "Infinity") ? true : offset <= total;
        
        return (offset >= 0 && total) ? offset : INVALID_VALUE;
    }
});

Y.namespace("Paginator").Core = Core;