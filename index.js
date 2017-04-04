#!/usr/bin/env node

const getOptionsByArgs = require('./get-options-by-args.js');

const args = process.argv.slice(2);
const options = getOptionsByArgs(args);

console.log(options);
