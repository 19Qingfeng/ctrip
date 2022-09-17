#!/usr/bin/env node
const semver = require('semver');
const program = require('commander');
const chalk = require('chalk');
const minimist = require('minimist');

const cliName = 'corp/cli';

const requiredVersion = require('../package.json').engines.node;

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(
      chalk.red(
        'You are using Node ' +
          process.version +
          ', but this version of ' +
          id +
          ' requires Node ' +
          wanted +
          '.\nPlease upgrade your Node version.'
      )
    );
    process.exit(1);
  }
}

checkNodeVersion(requiredVersion, 'corp');

program
  .version(`${cliName} ${require('../package').version}`)
  .usage('<command> [options]');

program
  .command('create')
  .description(`create a new component powered by ${cliName}`)
  .option('--prefix, --prefix cwd path <path string>')
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(
        chalk.yellow(
          "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
        )
      );
    }
    console.log(options.prefix, 'options');
    // console.log(program.args, 'program.args');
    require('../src/create/index')(name, options);
  });

program.on('--help', () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `${cliName} <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

program.parse(process.argv);
