const glob = require('glob');
const { readFileSync } = require('jsonfile');
const { remove } = require('fs-extra');

glob('src/*/meta/*.json', null, (err, files) => {
    let modules = [];

    for (let file of files) {
        let moduleJSON = readFileSync(file);
        
        for (let module of Object.keys(moduleJSON)) {
            modules.push(module);
            if (moduleJSON[module].submodules) {
                modules.push(...Object.keys(moduleJSON[module].submodules));
            }
        }
        //modules.push(...Object.keys(moduleJSON));
    }

    //console.log('Modules in src/', modules);
    let allModules = new Set(modules);

    glob('build/*', null, async (err, moduleDirs) => {
        let dirsToDelete = moduleDirs.filter((dir) =>
            !allModules.has(dir.replace(/.*\//, ''))
        );

        //console.log('Modules in build/ NOT in src/', dirsToDelete);

        for (let dir of dirsToDelete) {
            await(remove(dir));
        }
    });
});
