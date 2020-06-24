const glob = require('glob');
const { ensureDirSync, moveSync, statSync } = require('fs-extra');
const path = require('path');

glob('src/*', null, (err, dirs) => {
    for (let dir of dirs) {
        let module = dir.replace(/.*\//, '');
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
