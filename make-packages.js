const glob = require('glob');
const path = require('path');
const { writeJsonSync, moveSync } = require('fs-extra');

global.YUI = {
    add(name, callback, version, meta = {}) {
        let dependencies = {
            "y": "file:../y/y.js",
            ...(meta.requires &&
                Object.fromEntries(
                    meta.requires.map((module) => [module, `file:../${module}/${module}.js`])
                )
            )
        };

        writeJsonSync(`src/${name}/pkg.json`, {
          "name": name,
          "version": "1.0.0",
          "description": "",
          "main": `${name}.js`,
          dependencies,
          yuiMeta: meta,
          "author": "",
          "license": "ISC"
        }, { spaces: 2 });
    }
};

glob('src/*/*.js', null, (err, moduleFiles) => {
    for (let file of moduleFiles) {
        require(`./${file}`);
    }

    glob('src/*/pkg.json', null, (err, packageFiles) => {
        for (let file of packageFiles) {
            let moduleDir = path.dirname(file);
            moveSync(file, `${moduleDir}/package.json`);
        }
    });
});

