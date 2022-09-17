const path = require('path');
const fs = require('fs-extra');
/**
 *
 * @param {string} dir
 * @param {Record<string,string|Buffer>} files
 * @param {Record<string,string|Buffer>} [previousFiles]
 * @param {Set<string>} [include]
 */
exports.writeFileTree = async function (dir, files, previousFiles, include) {
  console.log(dir, 'dir');
  console.log(files, 'fiels');
  Object.keys(files).forEach((name) => {
    if (include && !include.has(name)) return;
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
};
