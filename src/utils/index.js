exports.chalk = require('chalk');
exports.semver = require('semver');
exports.inquirer = require('inquirer');

['clearConsole', 'utils', 'writeFileTree'].forEach((m) => {
  Object.assign(exports, require(`./${m}`));
});
