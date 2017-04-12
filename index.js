#!/usr/bin/env node

// libraries imports
const SimpleGit = require('simple-git');

// configuration imports
const getOptions = require('./get-options.js');

// Promise imports
const readPromise = require('./read-promise.js');
const getCommitIds = require('./get-commit-ids.js');
const getCommitEdits = require('./get-commit-edits.js');
const getCommitDetails = require('./get-commit-details.js');
const convertLcovToData = require('./convert-lcov-to-data.js');
const sendData = require('./send-data.js');

const options = getOptions();
const simpleGit = SimpleGit(options.gitPath);

// Same config passed to all promises
const config = Object.assign(
  {
    simpleGit
  },
  options
);

Promise.all(
  [
    getCommitIds(config)
    .then(commitIds => Promise.all(
      [
        Promise.all(commitIds.map(commitId => getCommitDetails(commitId, config))),
        Promise.all(commitIds.map(commitId => getCommitEdits(commitId, config)))
      ]
    )
    .then(([
      commitsDetails,
      commitsFiles
    ]) => {
      // transform commits arrays to single object with key - commit id, value - commit details and files
      const commits = {};

      commitIds.forEach((commitId, commitIdIndex) => {
        const commitDetails = commitsDetails[commitIdIndex];
        const commitFiles = commitsFiles[commitIdIndex];

        commits[commitId] = Object.assign({
          files: commitFiles
        }, commitDetails);
      });

      return commits;
    })
    ),
    readPromise(config.lcovPath)
    .then(lcovInput => convertLcovToData(lcovInput, config))
  ]
).then(([
  history,
  coverage
]) => sendData({
  branch: 'master',
  history,
  coverage
}, config))
.catch(err => {
  throw err;
});

/* example sent data -
{
  "branch": "master",
  "history": {
    "9e3193539da2da70df8e5b8dc8487e63978ec15d": {
      "files": [
        {
          "file": "convert-lcov-to-data.js",
          "changes": 10,
          "insertions": 2,
          "deletions": 2
        },
        {
          "file": "get-options-by-args.js",
          "changes": 6,
          "insertions": 2,
          "deletions": 1
        },
        {
          "file": "index.js",
          "changes": 121,
          "insertions": 34,
          "deletions": 14
        },
        {
          "file": "package.json",
          "changes": 3,
          "insertions": 1,
          "deletions": 1
        },
        {
          "file": "send-data.js",
          "changes": 22,
          "insertions": 4,
          "deletions": 5
        }
      ],
      "date": "2017-04-10 14:31:51 +0300",
      "message": "Gathered lcov details (HEAD, origin/master, master)",
      "authorName": "Yuval Saraf",
      "authorEmail": "unimonkiez@gmail.com"
    }
  },
  "coverage": [
    {
      "file": "index.js",
      "source": "...", // all the source of the file! MUHAHA
      "lines": [
        {
          "line": 1,
          "hit": 1
        },
        {
          "line": 5,
          "hit": 1
        },
        {
          "line": 10,
          "hit": 1
        },
        {
          "line": 11,
          "hit": 1
        },
        {
          "line": 12,
          "hit": 1
        },
        {
          "line": 13,
          "hit": 1
        },
        {
          "line": 14,
          "hit": 1
        },
        {
          "line": 15,
          "hit": 1
        },
        {
          "line": 16,
          "hit": 1
        }
      ]
    }
  ]
}
*/
