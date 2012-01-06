var L = Y.Lang,
    parse = Y.DataType.Number.parse,
    YAindexOf = Y.Array.indexOf,
    Base;

Base = function() {};

Base.ATTRS = {
    per : {
        value : 1,
        setter : "_numberSetter"
    },
    
    total : {
        setter : "_numberSetter"
    },
    
    page : {
        value : 1,
        validator : "_pageValidator"
    },
    
    offset : {
        value : 0,
        validator : "_offsetValidator"
    },
    
    details : {
        value : {}
    }
};

Y.mix(Base.prototype, {
    
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
        console.log("destructor"); //TODO: REMOVE DEBUGGING
        
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
    
    //Private
    _calculate : function(max, per) {
        var offsets = [],
            pages = [],
            i = 0,
            offset;
        
        for(;i < max; i++) {
            offset = i * per;
            
            offsets[offsets.length] = offset;
            pages[pages.length] = i + 1;
        }
        
        this._offsets = offsets;
        this._pages = pages;
    },
    
    _update : function(e) {
        //short-circuit internal updates
        if(e && e.internal) {
            return;
        }
        
        var o = this.getAttrs([ "per", "total", "offset", "page" ]),
            max = Math.ceil(o.total / o.per),
            source = { internal : true },
            pages, offsets, first, prev, current, next, last;
        
        //quick sanity check
        !L.isValue(max) && (max = 0);
        
        //TODO: only recalc on per/total changing
        this._calculate(max, o.per);
        
        pages = this._pages;
        offsets = this._offsets;
        
        current = L.isValue(o.page) ? o.page : Y.Array.indexOf(offsets, o.offset);
        (!current || current === -1) && (current = 0);
        
        next = current + 1;
        (!L.isValue(next) || next > max) && (next = false);
        
        prev = current - 1;
        (!L.isValue(prev) || prev < 1) && (prev = false);

        first = prev ? 1 : false;
        last  = (next && pages.length) ? max : false;
        
        //update attributes w/ what we calculated
        this.set("details", {
            pages   : pages,
            offsets : offsets,
            
            page    : current,
            offset  : offsets[current - 1] || 0,
            
            first   : first,
            prev    : prev,
            next    : next,
            last    : last
        });
        
        this.set("page", current, source);
        this.set("offset", offsets[current - 1] || 0, source);
    },
    
    //Attribute-related fns
    _numberSetter : function(value, attribute) {
        var result = parse(value);
        
        return (result === null) ? Y.Attribute.INVALID_VALUE : result;
    },
    

    _pageValidator : function(value) {
        var page = parse(value);
        
        if(!L.isNumber(page) || page < 1 || (this._pages && page > this._pages.length)) {
            return false;
        }
        
        return true;
    },
    
    _offsetValidator : function(value) {
        var offset = parse(value),
            offsets = this._offsets,
            last = offsets && offsets.length - 1;
        
        if(!L.isNumber(offset) ||
           (offsets && offset < offsets[0]) || //less than the first offset
           (offsets && offsets[last] && offset > offsets[last])) { //greater than the last offset
            return false;
        }
        
        return true;
    }
});

Y.PaginatorBase = Base;