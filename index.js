const http = require('http');
const https = require('https');
const minify = require('html-minifier').minify;

function getRequest(url) {

  return Promise.all([
    new Promise((resolve, reject) => {
      const req = https.get(url, res => {
        let rawData = '';

        res.on('data', chunk => {
          rawData += chunk;
          
        });

        res.on('end', () => {
          try {
            resolve((rawData));
          } catch (err) {
            reject(new Error(err));
          }
        });
      });

      req.on('error', err => {
        reject(new Error(err));
      });
    })
  ]);
}

exports.handler = async (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;

    var querystring = request.querystring;
    var requestDomain = "https://dashboard.n49.com";
    // join the requestDomain and querystring
    var requestURL = requestDomain + request.uri + '?' + querystring;
    var res = await getRequest(requestURL);

    // make a https request to the requestURL
    // and get the response
    // and then minify the response
    try {
      var resBody = minifyHTML(res[0]);
     
    }
    catch (err) {
      var resBody = "Error: " + err;
    }

    response.body = resBody;

  callback(null, response);

};

function minifyHTML(html) {
  return minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
  });
}