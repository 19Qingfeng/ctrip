const { capitalize, camelCase } = require('lodash');
const execa = require('execa');
const run = (shell, args, options = {}) => execa(shell, args, options);

/**
 *
 * @param {*} name
 * @returns
 */
exports.parserComponentName = (name) =>
  camelCase(name).slice(0, 1).toUpperCase() + camelCase(name).slice(1);

exports.getGitConfig = async () => {
  const [{ stdout: name }, { stdout: email }] = await Promise.all([
    run('git', ['config', 'user.name']),
    run('git', ['config', 'user.email']),
  ]);
  return [name, email];
};
