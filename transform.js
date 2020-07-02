const glob = require('glob');
const { execSync } = require('child_process');
const {
    ensureDirSync,
    existsSync,
    readFileSync,
    writeFileSync,
    writeJsonSync,
} = require('fs-extra');


// Prefix all module dirs with yui (src/panel -> src/yui-panel)
execSync('cd src && for moduleDir in *; do mv $moduleDir yui-$moduleDir; done; cd -');

const getDependencies = ({ requires, use }) =>
    (requires || use || [])
        .filter((module) => !module.includes('css'));

const createPackageJson = (module, mainFile, meta) => {
    let dependencies = {
        ...(Object.fromEntries(
            getDependencies(meta).map((dep) => [
                `yui-${dep}`, `file:../yui-${dep}/${dep}.js`
            ])
        )),
        "yui-y": "file:../yui-y/y.js",
    };

    writeJsonSync(`src/${module}/package.json`, {
      "name": module,
      "version": "1.0.0",
      "description": "",
      "main": mainFile,
      dependencies,
      yuiMeta: meta,
      "author": "",
      "license": "ISC"
    }, { spaces: 2 });

};

const unwrap = (moduleFile) => {
    // Strip the YUI.add wrapper
    if (existsSync(moduleFile)) {
        // Strip the YUI.add wrapper with a naive sed call removing the
        // first and last lines of the file.
        execSync(`sed -i '' '1d' ${moduleFile} && sed -i '' -e '$ d' ${moduleFile};`);
    }
};

const addImportsAndExport = (moduleFile, meta) => {
    let moduleBody = existsSync(moduleFile) ? readFileSync(moduleFile) : '';

    writeFileSync(moduleFile,
        "const Y = require('yui-y');\n" +
        getDependencies(meta)
            .map((dep) => `require('yui-${dep}');`)
            .join("\n") +

        "\n" +

        moduleBody +

        "\nmodule.exports = Y;\n"
    );
};

// Mock the YUI global and its add() method to
// 1. create package.json files
// 2. remove the YUI.add() wrapper
// 3. add import statements
global.YUI = {
    add(name, callback, version, meta = {}) {
        let namespacedName = `yui-${name}`;
        let mainFile = `${name}.js`;
        let moduleFile = `src/${namespacedName}/${mainFile}`

        createPackageJson(namespacedName, mainFile, meta);

        unwrap(moduleFile);

        addImportsAndExport(moduleFile, meta);
    }
};

glob('src/*/*.js', null, (err, moduleFiles) => {
    for (let file of moduleFiles) {
        require(`./${file}`);
    }

});


// Create the rollup modules
let rollups = {
    "anim": {
        "use": [
            "anim-base",
            "anim-color",
            "anim-curve",
            "anim-easing",
            "anim-node-plugin",
            "anim-scroll",
            "anim-xy"
        ]
    },
    "anim-shape-transform": {
        "use": [
            "anim-shape"
        ]
    },
    "app": {
        "use": [
            "app-base",
            "app-content",
            "app-transitions",
            "lazy-model-list",
            "model",
            "model-list",
            "model-sync-rest",
            "model-sync-local",
            "router",
            "view",
            "view-node-map"
        ]
    },
    "attribute": {
        "use": [
            "attribute-base",
            "attribute-complex"
        ]
    },
    "attribute-events": {
        "use": [
            "attribute-observable"
        ]
    },
    "autocomplete": {
        "use": [
            "autocomplete-base",
            "autocomplete-sources",
            "autocomplete-list",
            "autocomplete-plugin"
        ]
    },
    "base": {
        "use": [
            "base-base",
            "base-pluginhost",
            "base-build"
        ]
    },
    "cache": {
        "use": [
            "cache-base",
            "cache-offline",
            "cache-plugin"
        ]
    },
    "collection": {
        "use": [
            "array-extras",
            "arraylist",
            "arraylist-add",
            "arraylist-filter",
            "array-invoke"
        ]
    },
    "color": {
        "use": [
            "color-base",
            "color-hsl",
            "color-harmony"
        ]
    },
    "controller": {
        "use": [
            "router"
        ]
    },
    "dataschema": {
        "use": [
            "dataschema-base",
            "dataschema-json",
            "dataschema-xml",
            "dataschema-array",
            "dataschema-text"
        ]
    },
    "datasource": {
        "use": [
            "datasource-local",
            "datasource-io",
            "datasource-get",
            "datasource-function",
            "datasource-cache",
            "datasource-jsonschema",
            "datasource-xmlschema",
            "datasource-arrayschema",
            "datasource-textschema",
            "datasource-polling"
        ]
    },
    "datatype-date": {
        "use": [
            "datatype-date-parse",
            "datatype-date-format",
            "datatype-date-math"
        ]
    },
    "datatype-number": {
        "use": [
            "datatype-number-parse",
            "datatype-number-format"
        ]
    },
    "datatype-xml": {
        "use": [
            "datatype-xml-parse",
            "datatype-xml-format"
        ]
    },
    "dd": {
        "use": [
            "dd-ddm-base",
            "dd-ddm",
            "dd-ddm-drop",
            "dd-drag",
            "dd-proxy",
            "dd-constrain",
            "dd-drop",
            "dd-scroll",
            "dd-delegate"
        ]
    },
    "dom": {
        "use": [
            "dom-base",
            "dom-screen",
            "dom-style",
            "selector-native",
            "selector"
        ]
    },
    "event": {
        "after": [
            "node-base"
        ],
        "use": [
            "event-base",
            "event-delegate",
            "event-synthetic",
            "event-mousewheel",
            "event-mouseenter",
            "event-key",
            "event-focus",
            "event-resize",
            "event-hover",
            "event-outside",
            "event-touch",
            "event-move",
            "event-flick",
            "event-valuechange",
            "event-tap"
        ]
    },
    "event-custom": {
        "use": [
            "event-custom-base",
            "event-custom-complex"
        ]
    },
    "event-gestures": {
        "use": [
            "event-flick",
            "event-move"
        ]
    },
    "handlebars": {
        "use": [
            "handlebars-compiler"
        ]
    },
    "highlight": {
        "use": [
            "highlight-base",
            "highlight-accentfold"
        ]
    },
    "history": {
        "use": [
            "history-base",
            "history-hash",
            "history-html5"
        ]
    },
    "node": {
        "use": [
            "node-base",
            "node-event-delegate",
            "node-pluginhost",
            "node-screen",
            "node-style"
        ]
    },
    "pluginhost": {
        "use": [
            "pluginhost-base",
            "pluginhost-config"
        ]
    },
    "querystring": {
        "use": [
            "querystring-parse",
            "querystring-stringify"
        ]
    },
    "recordset": {
        "use": [
            "recordset-base",
            "recordset-sort",
            "recordset-filter",
            "recordset-indexer"
        ]
    },
    "template": {
        "use": [
            "template-base",
            "template-micro"
        ]
    },
    "text": {
        "use": [
            "text-accentfold",
            "text-wordbreak"
        ]
    },
    "widget": {
        "use": [
            "widget-base",
            "widget-htmlparser",
            "widget-skin",
            "widget-uievents"
        ]
    },
};

for (let [name, meta] of Object.entries(rollups)) {
    ensureDirSync(`src/yui-${name}`, 0o2775);

    YUI.add(name, null, null, meta)
}
