const lcovParse = require('lcov-parse');
const path = require('path');
const readPromise = require('./read-promise.js');
const arrayToMappedObject = require('./array-to-mapped-object.js');

module.exports = (
  input,
  {
    gitPath
  }
) => new Promise((res, rej) => {
  lcovParse(input, (parseErr, lcovData) => {
    if (parseErr) {
      rej(parseErr);
    } else {
      const data = lcovData.map(
        lcovFileData => ({
          fileName: path.relative(gitPath, lcovFileData.file),
          lines: lcovFileData.lines.details,
          branches: lcovFileData.branches.details,
          functions: lcovFileData.functions.details
        })
      );
      res(data);
    }
  });
})
.then(data => Promise.all(
  // Add source to files
  data.map(lcovFileData => readPromise(
    path.join(gitPath, lcovFileData.fileName)
  ).then(source => Object.assign(
    {},
    lcovFileData,
    {
      source
    }
  )))
))
.then(arr => arr.map(data => Object.assign(
  {},
  data,
  {
    fileName: undefined,
    file: data.fileName
  }
)));
