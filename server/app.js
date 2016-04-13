require('dotenv').config();

var express     = require('express');
// Required globally for now, hitting Docker's image cache
var ParseServer = require('/usr/local/lib/node_modules/parse-server').ParseServer;

var app         = express();
var api         = new ParseServer({
  serverURL         : 'http://192.168.99.100:1337/parse',
  // Connection string URI for your MongoDB
  databaseURI       : process.env.databaseURI,
  // Path to your app’s Cloud Code
  // cloud          : './cloud/main.js',
  // A unique identifier for your app
  appId             : process.env.appId,
  // A key that specifies a prefix used for file storage. For migrated apps, this is necessary to provide access to files already hosted on Parse.
  // fileKey        : 'myFileKey',
  // A key that overrides all permissions. Keep this secret.
  masterKey         : process.env.masterKey,
  // The client key for your app. (optional)
  // clientKey      : 'myClientKey',
  // The REST API key for your app. (optional)
  // restAPIKey     : 'myRestAPIKey',
  // The JavaScript key for your app. (optional)
  // javascriptKey  : 'myJavascriptKey',
  // The .NET key for your app. (optional)
  // dotNetKey      : 'myDotNetKey',
  // See the Push wiki page https://github.com/ParsePlatform/parse-server/wiki/Push
  // push           : { ... },
  // filesAdapter   : ...,
  // Configure support for 3rd party authentication. see https://github.com/ParsePlatform/parse-server/wiki/Parse-Server-Guide#oauth
  oauth             : {
   twitter  : {
     consumer_key   : process.env.consumer_key,
     consumer_secret: process.env.consumer_secret,
   }
  }
});

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

var port = 1337;
app.listen(port, function() {
  console.log(`parse-server-example running on port ${port}`);
});
