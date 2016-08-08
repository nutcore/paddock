var env           = require('./config/env');

if (env.is('development')) {
  require('dotenv').config();
}

var express       = require('express');
// Required globally for now, hitting Docker's image cache
var ParseServer   = require('/usr/lib/node_modules/parse-server').ParseServer;
// var ParseServer = require('parse-server').ParseServer;

var path          = require('path');
var oauthshim     = require('oauth-shim');

const hostname  = process.env.SERVER_URL || "0.0.0.0"; // localhost
// The default port is 1337, specify this ENV variable to use a different port
const port      = process.env.PORT || 1337;

// Serve the Parse API on the /parse URL prefix
const mount     = process.env.PARSE_MOUNT || '/parse';

var api = new ParseServer(
  env.parse({
    'hostname'  : hostname,
    'port'      : port,
    'mount'     : mount,
  })
);

// Initiate the shim with Client ID's and secret
oauthshim.init(
  env.oauth({
    'hostname'  : hostname,
  })
);

var app = express();

// Serve the Parse API on the /parse URL prefix
app.use(mount, api);

// OAuth2 shim for OAuth1 services, works with the clientside library HelloJS
app.all('/oauthproxy', oauthshim);

// Serve static assets from the /public folder
app.use('/', express.static(path.join(__dirname, '/public')));

app.listen(port, function() {
  console.log(`parse-server-example running on http://${hostname}${port ? `:${port}` : ''}${mount}`);
});
