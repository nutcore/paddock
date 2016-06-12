require('dotenv').config();

var express     = require('express');
// Required globally for now, hitting Docker's image cache
var ParseServer = require('/usr/local/lib/node_modules/parse-server').ParseServer;

var oauthshim   = require('oauth-shim');

// Check 'docker-machine ip' || 192.168.99.100 if you have trouble connecting
const hostname  = "localhost";

var app = express();
var api = new ParseServer({
  serverURL           : `http://${hostname}:1337/parse`,
  // Connection string URI for your MongoDB
  databaseURI         : process.env.databaseURI,
  // Path to your app’s Cloud Code
  cloud               : './cloud/main.js',
  // A unique identifier for your app
  appId               : process.env.appId,
  // A key that specifies a prefix used for file storage. For migrated apps, this is necessary to provide access to files already hosted on Parse.
  // fileKey          : 'myFileKey',
  // A key that overrides all permissions. Keep this secret.
  masterKey           : process.env.masterKey,
  // The client key for your app. (optional)
  // clientKey        : 'myClientKey',
  // The REST API key for your app. (optional)
  // restAPIKey       : 'myRestAPIKey',
  // The JavaScript key for your app. (optional)
  // javascriptKey    : 'myJavascriptKey',
  // The .NET key for your app. (optional)
  // dotNetKey        : 'myDotNetKey',
  // See the Push wiki page https://github.com/ParsePlatform/parse-server/wiki/Push
  // push             : { ... },
  // filesAdapter     : ...,
  // Configure support for 3rd party authentication. see https://github.com/ParsePlatform/parse-server/wiki/Parse-Server-Guide#oauth
  oauth: {
    twitter: {
      consumer_key    : process.env.consumer_key,
      consumer_secret : process.env.consumer_secret,
    }
  },
  // Enable email verification
  verifyUserEmails    : true,
  // The public URL of your app.
  // This will appear in the link that is used to verify email addresses and reset passwords.
  // Set the mount path as it is in serverURL
  publicServerURL     : `http://${hostname}:1337/parse`,
  // Your apps name. This will appear in the subject and body of the emails that are sent.
  appName             : 'Parse App',
  // The email adapter
  emailAdapter: {
    module            : 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress     : 'parse@example.com',
      // Your domain from mailgun.com
      domain          : 'example.com',
      // Your API key from mailgun.com
      apiKey          : process.env.mailAPIKey,
    }
  }
});

// Initiate the shim with Client ID's and secret
oauthshim.init([
  {
    name              : 'twitter',
    // id : secret
    client_id         : process.env.consumer_key,
    client_secret     : process.env.consumer_secret,
    // Define the grant_url where to exchange Authorisation codes for tokens
    grant_url         : 'https://api.twitter.com/oauth/access_token',
    // Restrict the callback URL to a delimited list of callback paths
    domain            : `${hostname}:8080`
  }
]);

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

// OAuth2 shim for OAuth1 services, works with the clientside library HelloJS
app.all('/oauthproxy', oauthshim);

var port = 1337;
app.listen(port, function() {
  console.log(`parse-server-example running on ${hostname}:${port}`);
});
