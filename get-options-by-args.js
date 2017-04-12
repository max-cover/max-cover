const path = require('path');
const decamelize = require('decamelize');

const nameToCLName = name => `--${decamelize(name, '-')}`; // `lcovPath` => `--lcov-path`
const requiredParams = [
  'lcovPath'
];
const params = [
  'gitPath',
  'appPath'
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
    gitPath: cwd,
    appPath: '10.0.0.3:8080'
  };

  // Add requiredParams to options object
  requiredParams.forEach(requiredParam => {
    const cLName = nameToCLName(requiredParam);
    const requiredParamIndex = args.indexOf(cLName);
    if (requiredParamIndex === -1) {
      throw Error(`Must provide '${cLName}'.`);
    } else {
      const requiredParamValue = args[requiredParamIndex + 1];
      if (requiredParamValue === undefined) {
        throw Error(`Must provide '${cLName}' with value.`);
      } else {
        options = Object.assign({}, options, {
          [requiredParam]: requiredParamValue
        });
      }
    }
  });

  // Add params to options object
  params.forEach(param => {
    const cLName = nameToCLName(param);
    const paramIndex = args.indexOf(cLName);
    if (paramIndex !== -1) {
      const paramValue = args[paramIndex + 1];
      if (paramValue === undefined) {
        throw Error(`Must provide '${cLName}' with value.`);
      } else {
        options = Object.assign({}, options, {
          [param]: paramValue
        });
      }
    }
  });

  // Add booleanParams to options object
  booleanParams.forEach(booleanParam => {
    const cLName = nameToCLName(booleanParam);
    const booleanParamValue = args.indexOf(cLName) !== -1;
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
