const EventsEmitter = require('events');
const ejs = require('ejs');
const path = require('path');
const {
  clearConsole,
  chalk,
  inquirer,
  parserComponentName,
  writeFileTree,
} = require('../utils/index');
const { getGitConfig } = require('../utils/utils');

class Creator extends EventsEmitter {
  constructor({ targetDir }) {
    super();
    this.targetDir = targetDir;

    this.files = {};
    this.dirName = '';
    this.packageName = '';
    this.on('startAction', (message) => {
      chalk.green(`start ${message}...`);
    });
  }

  async create() {
    await clearConsole();

    // 文件夹名称 & 包名称
    await this.promptProjectInfo();

    this.emit('startAction', 'create package.json...');

    // 1. 创建 package.json
    const createPck = await this.genPackageJson();

    // 2. 创建基础目录
    this.emit('startAction', 'create source Dir...');
    const createSrc = this.createFiles();

    // 2. 创建配置文件
    const createConfig = this.createConfigFiles();

    const createReadme = this.createReadMeFile();

    const createStories = this.createStories();

    await Promise.all([createSrc, createConfig, createReadme, createStories]);
    // 4. 写入文件
    await this.emitFiles();
    // done
    this.emitLogo();
  }

  async genPackageJson() {
    const [author, email] = await getGitConfig();
    const componentName = this.packageName;
    const dirName = this.dirName;

    this.files['package.json'] = await ejs.renderFile(
      path.resolve(__dirname, '../template/package.ejs'),
      {
        componentName,
        description: 'Ui Component',
        homepage:
          "http://git.dev.sh.ctripcorp.com/corp-framework-components/corp-framework-international-components'",
        dirName,
        issuesUrl:
          'http://git.dev.sh.ctripcorp.com/corp-framework-components/corp-framework-international-components/-/issues',
        author,
        email,
      }
    );
  }

  async promptProjectInfo() {
    const { dirName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'dirName',
        message: '创建的目录名称',
        validate: (input) => (input ? true : '目录不存在'),
      },
    ]);
    // 包名称
    const { packageName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'packageName',
        message: '包名称',
        validate: (input) => (input ? true : '包名不正确'),
        default: `@ctrip/${dirName}`,
      },
    ]);
    this.dirName = dirName;
    this.packageName = packageName;
  }

  async createFiles() {
    // index.ts
    this.files['index.tsx'] = "export * from './src/index'";
    // src/index.tsx
    this.files['src/index.tsx'] = await ejs.renderFile(
      path.resolve(__dirname, '../template/index.ejs'),
      {
        componentName: parserComponentName(this.dirName),
      }
    );
    this.files['src/style/index.css'] = '';
  }

  async createConfigFiles() {
    // 创建 tsconfig.json
    this.files['tsconfig.json'] = await ejs.renderFile(
      path.resolve(__dirname, '../template/tsconfig.ejs')
    );
  }

  async createReadMeFile() {
    const packageInfo = JSON.parse(this.files['package.json']);
    const {
      name,
      license,
      homepage,
      bugs: { url },
    } = packageInfo;
    const docUrl =
      'https://static.fws.qa.nt.ctripcorp.com/modules/corp/corp-framework-international-components-doc/index.html';
    this.files['readme.md'] = await ejs.renderFile(
      path.resolve(__dirname, '../template/readme.ejs'),
      {
        projectDocumentationUrl: docUrl, // 文档 URL
        licenseName: license,
        projectName: name,
        authorName: packageInfo.author,
        installCommand: `npm install ${name}`,
        authorWebsite: false,
        projectDescription: `商旅公共组件: ${name}`,
        projectHomepage: homepage,
        issuesUrl: url,
        usage: docUrl,
        testCommand: false,
        licenseUrl: false,
      }
    );
  }

  async createStories() {
    this.files['stories/index.stories.tsx'] = await ejs.renderFile(
      path.resolve(__dirname, '../template/stories.ejs'),
      {
        componentName: parserComponentName(this.dirName),
      }
    );
  }

  async emitFiles() {
    await writeFileTree(path.join(this.targetDir, this.dirName), this.files);
  }

  async emitLogo() {
    await clearConsole();
    console.log(`
      created a new package: ${chalk.green(this.packageName)}
    `);
  }
}

module.exports = Creator;
