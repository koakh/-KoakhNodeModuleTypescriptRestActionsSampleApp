const http = require('https');

const options = {
  method: 'GET',
  hostname: 'es.critical-links.com',
  port: '9443',
  path: '/release/4.1',
  headers: {
    authorization: 'Bearer xqaTGS1Df46lHS6B378n3Omp1SC6EhLrHvaCck4byvO8Lqkz8lNaYG2v1lprVSoi'
  }
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on('data', function (chunk) {
    chunks.push(chunk);
  });

  res.on('end', function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();