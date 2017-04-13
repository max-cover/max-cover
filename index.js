#!/usr/bin/env node

// libraries imports
const SimpleGit = require('simple-git');

// configuration imports
const getOptions = require('./get-options.js');

// Promise imports
const readPromise = require('./read-promise.js');
const getCommitIds = require('./get-commit-ids.js');
const getCommitFiles = require('./get-commit-files.js');
const getCommitDetails = require('./get-commit-details.js');
const getFilesCoverageByLcov = require('./get-files-coverage-by-lcov.js');
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
        Promise.all(commitIds.map(commitId => getCommitFiles(commitId, config)))
      ]
    )
    .then(([
      commitsDetails,
      commitsFiles
    ]) => {
      // transform commits arrays to single array
      const target = [];

      commitIds.forEach((commitId, commitIdIndex) => {
        const commitDetails = commitsDetails[commitIdIndex];
        const commitFiles = commitsFiles[commitIdIndex];

        target.push(
          Object.assign(
            {},
            commitDetails,
            {
              files: commitFiles,
              hash: commitId
            }
          )
        );
      });

      return target;
    })
    ),
    readPromise(config.lcovPath)
    .then(lcovInput => getFilesCoverageByLcov(lcovInput, config))
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
  console.error(err);
  process.exit(1);
});

/* example sent data -

 --- NOTES ---
* `data.history` array is sorted by `git log` command.
* `data.history[index].files` and `data.coverage` are both files object where key is the file name relative to the git root.
* Nonrelevent lines are simply missing from `data.coverage[file].lines` array.

{
  "branch": "master",
  "history": [
    {
      "date": "2017-04-13 01:50:15 +0300",
      "message": "Finished gathering data and sending it to given url (HEAD, origin/master, master)",
      "authorName": "Yuval Saraf",
      "authorEmail": "unimonkiez@gmail.com",
      "files": {
        "convert-lcov-to-data.js": {
          "changes": 33,
          "insertions": 0,
          "deletions": 33
        },
        "get-commit-edits.js": {
          "changes": 14,
          "insertions": 0,
          "deletions": 14
        },
        "get-options-by-args.js": {
          "changes": 4,
          "insertions": 1,
          "deletions": 3
        },
        "get-options-by-env.js": {
          "changes": 5,
          "insertions": 0,
          "deletions": 5
        },
        "index.js": {
          "changes": 27,
          "insertions": 17,
          "deletions": 10
        }
      },
      "hash": "5fe7d5d60605748706b400dfb83e38916cfae4e6"
    }
  ],
  "coverage": {
    "index.js": {
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
      ],
      "branches": [
        {
          "line": 1,
          "block": 1,
          "branch": 0,
          "taken": 1
        }
      ],
      "functions": [
        {
          "name": "(anonymous_1)",
          "line": 7,
          "hit": 9
        }
      ],
      "source": "..."
    }
  }
}
*/
