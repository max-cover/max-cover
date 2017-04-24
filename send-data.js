const request = require('request');


const send = ({
  data,
  url
}) => new Promise((res, rej) => {
  request({
    url,
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  }, (err, response, body) => {
    if (err) {
      rej(err);
    } else if (response.statusCode !== 200) {
      rej({
        response,
        body
      });
    } else {
      res(body);
    }
  });
});

module.exports = (data, { appUrl }) => send({
  url: `${appUrl}/api/data`,
  data
});
