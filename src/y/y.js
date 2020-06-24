export default const Y = {
    config: {
        bootstrap: true,
        cacheUse: true,
        debug: true,
        doc: document.documentElement,
        fetchCSS: true,
        lang: 'en-US',
        throwFail: true,
        useBrowserConsole: true,
        useNativeES5: true,
        win: window,
    },

    id: 1, // was Y.stamp(Y);

    Env: {
        _loader: {},
        DOMReady: true,
        windowLoaded: true,
        version: 1,
        core: ['get', 'features', 'intl-base', 'yui-log', 'yui-later'],
        loaderExtras: ['loader-rollup', 'loader-yui3'],
        mods: {}, // flat module map
        versions: {}, // version module map
        _idx: 0,
        _used: {},
        _attached: {},
        _exported: {},
        _missed: [],
        _yidx: 0,
        _uidx: 0,
        _guidp: 'y',
        _loaded: {},
    },

    // PUBLIC METHODS (mostly stubbed)
    applyConfig(config) {
        console.log('Y.applyConfig(config) called with', config);
    },

    applyTo(id, method, args) {
        console.log('Y.applyTo(id, method, args) called with', id, method, args);
    },

    instanceOf(obj, testClass) {
        return obj instanceof testClass;
    },

    log() { /* noop */ },

    message() { /* noop */ },

    destroy() {
        console.log('Y.destroy() called');
    },

    dump() {
        console.log('Y.dump(o) called');
    },

    error(msg, e, src) {
        //TODO Add check for window.onerror here

        var ret;

        if (this.config.errorFn) {
            ret = this.config.errorFn.apply(this, arguments);
        }

        if (!ret) {
            throw (e || new Error(msg));
        } else {
            this.message(msg, 'error', ''+src); // don't scrub this one
        }

        return this;
    },

    guid(pre) {
        var id = this.Env._guidp + '_' + (++this.Env._uidx);
        return (pre) ? (pre + id) : id;
    },

    namespace(path) {
        let tokens = path.split('.');
        let node = Y;

        for (let token in tokens) {
            node = node[token] || (node[token] = {});
        }

        return node;
    },

    require() {
        console.log('Y.require() called');
    },

    stamp(o, readOnly) {
        var uid;
        if (!o) {
            return o;
        }

        // IE generates its own unique ID for dom nodes
        // The uniqueID property of a document node returns a new ID
        if (o.uniqueID && o.nodeType && o.nodeType !== 9) {
            uid = o.uniqueID;
        } else {
            uid = (typeof o === 'string') ? o : o._yuid;
        }

        if (!uid) {
            uid = this.guid();
            if (!readOnly) {
                try {
                    o._yuid = uid;
                } catch (e) {
                    uid = null;
                }
            }
        }
        return uid;
    },

    use() {
        console.log('Y.use() called');
    },

    // PRIVATE METHODS (all stubbed)

    _init() {
        console.log('Y._init() called');
    },

    _afterConfig() {
        console.log('Y._afterConfig() called');
    },

    _attach() {
        console.log('Y._attach() called');
    },

    _delayCallback() {
        console.log('Y._delayCallback() called');
    },

    _notify() {
        console.log('Y._notify() called');
    },

    _setup() {
        console.log('Y._setup() called');
    },

    _use() {
        console.log('Y._use() called');
    },
};
