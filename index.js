#!/usr/bin/env node

const fs = require('fs');
const sendData = require('./send-data.js');
const convertLcovToData = require('./convert-lcov-to-data.js');
const getOptionsByArgs = require('./get-options-by-args.js');
const getOptionsByEnv = require('./get-options-by-env.js');

const argOptions = getOptionsByArgs(process.argv.slice(2));
const envOptions = getOptionsByEnv(process.env);

const read = readPath => new Promise((res, rej) => {
  fs.readFile(readPath, 'utf8', (readErr, lcovInput) => {
    if (readErr) {
      rej(readErr);
    } else {
      res(lcovInput);
    }
  });
});

read(argOptions.lcovPath)
  .then(lcovInput => convertLcovToData({
    input: lcovInput,
    gitPath: argOptions.gitPath
  }))
  .then(lcovData => {
    console.log(lcovData[0].lines[0]);
  })
  // .then(lcovData => sendData({
  //   url: argOptions.maxCoverUrl,
  //   token: envOptions.maxCoverToken,
  //   data: {
  //     lcovData
  //   }
  // }))
  .catch(err => {
    throw err;
  });
