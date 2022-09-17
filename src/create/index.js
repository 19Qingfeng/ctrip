// 本质上就是创建一个component目录，插入到对应的当前工作目录中
// const validateName = require('validate-npm-package-name');
const path = require('path');
const Creator = require('./creator');
const { clearConsole, chalk } = require('../utils/index');

// 验证包名称
// if (!result.validForNewPackages) {
//   console.error(chalk.red(`Invalid project name: "${name}"`));
//   result.errors &&
//     result.errors.forEach((err) => {
//       console.error(chalk.red.dim('Error: ' + err));
//     });
//   result.warnings &&
//     result.warnings.forEach((warn) => {
//       console.error(chalk.red.dim('Warning: ' + warn));
//     });
//   exit(1);
// }

// 检查目录是否存在
// if (fs.existsSync(targetDir)) {
//   chalk.red(`Target directory ${chalk.cyan(targetDir)} already exists.`);
//   process.exit(1);
// }

async function create(options) {
  const cwd = process.cwd();
  const { prefix = '' } = options;
  const finallyPath = path.join(cwd, prefix);
  try {
    const creator = new Creator({
      targetDir: finallyPath,
    });
    await creator.create();
  } catch (e) {
    clearConsole();
    console.log(chalk.red(e.message));
    console.log(chalk.red(e.stack));
  }
}

module.exports = create;
