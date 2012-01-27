var L = Y.Lang;

Y.Paginator = Y.Base.create("paginator", Y.Widget, [ Y.PaginatorBase ],
    {
        TEMPLATES : {
            //buttons
            BTN_BASE : "<button class='yui3-u {css}' {attrs}>{label}</button>",
                
            PREV  : [ "data-dir='prev'",    "&lt;" ],
            NEXT  : [ "data-dir='next'",    "&gt;" ],
            FIRST : [ "data-page='first'", "&lsaquo;&lsaquo;" ],
            LAST  : [ "data-page='last'", "&rsaquo;&rsaquo;" ],
            NAV   : [ "data-page='{page}'", "{page}" ],

            //general markup
            MAIN  : "<div class='yui3-g {css}' role='toolbar'>{first}{prev}{pages}{next}{last}</div>",
            PAGES : "<ul class='yui3-g yui3-u {css}' role='presentation'>{pages}</ul>",
            PAGE  : "<li class='yui3-u {css}' role='presentation'>{button}</li>"
        },

        CLASSES : [
            "first",
            "prev",
            "next",
            "last",
            "navigator",
            "page",
            "current",
            "disabled"
        ],

        initializer : function(config) {
            config || (config = {});

            this._templates = L.isObject(config.templates) ?
                Y.merge(this.TEMPLATES, config.templates) :
                this.TEMPLATES;
            
            this._classes = {};

            Y.Array.each(this.CLASSES, function(css) {
                this._classes[css.toUpperCase()] = this.getClassName(css);
            }, this);
        },
        
        destructor : function() {
            console.log("widget destructor"); //TODO: REMOVE DEBUGGING

            this._templates = this._classes = null;
        },
        
        renderUI : function() {
            var cb = this.get("contentBox"),
                attrs = this.getAttrs([ "first", "prev", "next", "last" ]),
                templates = this._templates,
                classes = this._classes,
                html;
            
            html = L.sub(templates.MAIN, {
                css : classes.NAVIGATOR,
                first : attrs.first ? this._renderButton(templates.FIRST, { css : classes.FIRST }) : "",
                prev  : attrs.prev  ? this._renderButton(templates.PREV,  { css : classes.PREV })  : "",
                pages : this._renderPages(),
                next  : attrs.next  ? this._renderButton(templates.NEXT,  { css : classes.NEXT })  : "",
                last  : attrs.last  ? this._renderButton(templates.LAST,  { css : classes.LAST })  : ""
            });

            cb.setContent(html);
        },
        
        bindUI : function() {
            console.log("widget bindUI"); //TODO: REMOVE DEBUGGING
            var bb = this.get("boundingBox");

            //direction arrow clicks
            bb.delegate("click", function(e) {
                e.preventDefault();

                console.log(e); //TODO: REMOVE DEBUGGING

            }, "button[data-dir]");

            //page arrow clicks
            bb.delegate("click", function(e) {
                e.preventDefault();

                console.log(e); //TODO: REMOVE DEBUGGING

            }, "button[data-page]");
        },
        
        syncUI : function() {
            console.log("widget syncUI"); //TODO: REMOVE DEBUGGING
        },

        _renderButton : function(template, config) {
            config || (config = {});

            return L.sub(this._templates.BTN_BASE, {
                css   : config.css || "",
                attrs : L.isObject(config.attrs) ? L.sub(template[0], config.attrs) : template[0],
                label : L.isObject(config.attrs) ? L.sub(template[1], config.attrs) : template[1]
            });
        },

        _renderPages : function() {
            //TODO: render some pages
            var attrs = this.getAttrs([ "details" ]),
                html = [];

            Y.Array.each(attrs.details.pages, function(page) {
                var css = this._classes.PAGE;
                //TODO: add active page class to the css

                html[html.length] = this._renderButton(this._templates.NAV, {
                        css : this._classes.PAGE,
                        attrs : {
                            page : page
                        }
                    });
            }, this);

            return html.join("");
        }
    }, {
        ATTRS : {
            //show first page link
            first : {
                value : true,
                validator : L.isBoolean
            },
            
            //show last page link
            last : {
                value : true,
                validator : L.isBoolean
            },
            
            //show prev page link
            prev : {
                value : true,
                validator : L.isBoolean
            },
            
            //show next page link
            next : {
                value : true,
                validator : L.isBoolean
            },

            //determine how many page numbers are shown around the current
            //0 shows all
            visible : {
                value : 0,
                validator : L.isNumber
            }
        }
    }
);