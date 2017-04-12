const getOptionsByArgs = require('./get-options-by-args.js');
const getOptionsByEnv = require('./get-options-by-env.js');

/*
Properties -
lcovPath
gitPath
maxCoverToken
*/
module.exports = () => {
  const argOptions = getOptionsByArgs(process.argv.slice(2));
  const envOptions = getOptionsByEnv(process.env);

  return Object.assign(
    {},
    envOptions,
    argOptions
  );
};
