const decamelize = require('decamelize');

const nameToEnvName = name => decamelize(name).toUpperCase(); // `maxCoverToken` => `MAX_COVER_TOKEN`
const requiredParams = [
];
const params = [
  'maxCoverToken'
];

module.exports = env => {
  let options = {};

  // Add requiredParams to options object
  requiredParams.forEach(requiredParam => {
    const cLName = nameToEnvName(requiredParam);
    const requiredParamValue = env[cLName];
    if (requiredParamValue === undefined) {
      throw Error(`Must provide '${cLName}' with value.`);
    } else {
      options = Object.assign({}, options, {
        [requiredParam]: requiredParamValue
      });
    }
  });

  // Add params to options object
  params.forEach(param => {
    const cLName = nameToEnvName(param);
    const paramValue = env[cLName];
    if (paramValue !== undefined) {
      options = Object.assign({}, options, {
        [param]: paramValue
      });
    }
  });

  return options;
};
