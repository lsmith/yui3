const glob = require('glob');
const path = require('path');
const {
    readJsonSync,
    readFileSync,
    writeFileSync,
    moveSync,
    existsSync,
} = require('fs-extra');

glob('src/*/package.json', null, (err, moduleConfigs) => {
    for (let file of moduleConfigs) {
        let {
            main,
            yuiMeta: {
                requires,
                use,
            },
        } = readJsonSync(file);

        if (!requires && !use) {
            continue;
        }

        let imports = [
            "const Y = import 'y';",
            ...(requires || use).map((module) => `import '${module}';`)
        ].join("\n") + "\n\n";

        let dir = path.dirname(file);
        let tmpFile = `${dir}/tmp`;
        let moduleFile = `${dir}/${main}`;

        if (existsSync(moduleFile)) {
            writeFileSync(tmpFile, imports + readFileSync(moduleFile));
            moveSync(tmpFile, moduleFile, { overwrite: true });
        }
    }
});

