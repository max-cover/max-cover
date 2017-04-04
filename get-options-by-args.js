const path = require('path');

const paramPrefix = '--';
const requiredParams = [
  'lcovPath'
];
const params = [
  'gitPath'
];
const booleanParams = [
];

// Tranform these params to absolute path
const pathsParams = [
  'lcovPath',
  'gitPath'
];

const cwd = process.cwd();

console.log(cwd);

module.exports = args => {
  let options = {
    gitPath: cwd
  };

  // Add requiredParams to options object
  requiredParams.forEach(requiredParam => {
    const requiredParamIndex = args.indexOf(paramPrefix + requiredParam);
    if (requiredParamIndex === -1) {
      throw Error(`Must provide '${paramPrefix}${requiredParam}'.`);
    } else {
      const requiredParamValue = args[requiredParamIndex + 1];
      if (requiredParamValue === undefined) {
        throw Error(`Must provide '${paramPrefix}${requiredParam}' with value.`);
      } else {
        options = Object.assign({}, options, {
          [requiredParam]: requiredParamValue
        });
      }
    }
  });

  // Add params to options object
  params.forEach(param => {
    const paramIndex = args.indexOf(paramPrefix + param);
    if (paramIndex !== -1) {
      const paramValue = args[paramIndex + 1];
      if (paramValue === undefined) {
        throw Error(`Must provide '${paramPrefix}${param}' with value.`);
      } else {
        options = Object.assign({}, options, {
          [param]: paramValue
        });
      }
    }
  });

  // Add booleanParams to options object
  booleanParams.forEach(booleanParam => {
    const booleanParamValue = args.indexOf(paramPrefix + booleanParam) !== -1;
    options = Object.assign({}, options, {
      [booleanParam]: booleanParamValue
    });
  });

  // Tranform all the defined pathsParams on options to absolute (if some are relative)
  pathsParams.forEach(pathsParam => {
    const currentPathsParamValue = options[pathsParam];
    if (currentPathsParamValue !== undefined) {
      const pathsParamValue = path.resolve(cwd, currentPathsParamValue);
      options = Object.assign({}, options, {
        [pathsParam]: pathsParamValue
      });
    }
  });

  return options;
};
