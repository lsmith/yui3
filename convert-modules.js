const glob = require('glob');
const { readFileSync, writeFileSync, moveSync } = require('fs-extra');
const path = require('path');

glob('src/*/*.js', null, (err, files) => {
    for (let file of files) {
        let module = path.basename(file, '.js');
        let dir = path.dirname(file);

        let code = readFileSync(file);

        ensureDirSync(`${dir}/src`, 0o2775);
        glob(`${dir}/${module}.*`, (err, moduleFiles) => {
            for (let file of moduleFiles) {
                if (statSync(file).isFile()) {
                    let filename = path.basename(file);
                    moveSync(`${file}`, `${dir}/src/${filename}`);
                }
            }
        });
    }
});
