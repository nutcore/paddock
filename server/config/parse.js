var path  = require('path');

module.exports = function(params, env) {
  var hostname    = params.hostname;
  var port        = params.port;
  var mount       = params.mount;

  // TODO https
  return {
    // URL to your Parse Server (don't forget to specify http:// or https://).
    // This URL will be used when making requests to Parse Server from Cloud Code.
    'serverURL'               : `http://${hostname}${port ? `:${port}` : ''}${mount}`,

    // The connection string for your database, i.e. mongodb://user:pass@host.com/dbname.
    // Be sure to URL encode your password if your password has special characters
    'databaseURI'             : process.env.DATABASE_URI,

    // The absolute path to your cloud code main.js file.
    'cloud'                   : path.join(__dirname, '..', process.env.CLOUD_CODE_MAIN || './cloud/main.js'),

    // The application id to host with this server instance. You can use any arbitrary string.
    // For migrated apps, this should match your hosted Parse app
    'appId'                   : process.env.APP_ID,

    // The master key to use for overriding ACL security. You can use any arbitrary string.
    // Keep it secret! For migrated apps, this should match your hosted Parse app
    'masterKey'               : process.env.MASTER_KEY,

    // A key that specifies a prefix used for file storage.
    // For migrated apps, this is necessary to provide access to files already hosted on Parse.
    // 'fileKey'              : process.env.FILE_KEY,

    // The client keys used with Parse are no longer necessary with Parse Server.
    // If you wish to still require them, perhaps to be able to refuse access to older clients,
    // you can set the keys at initialization time.
    // Setting any of these keys will require all requests to provide one of the configured keys.
    // clientKey
    // javascriptKey
    // restAPIKey
    // dotNetKey

    // The client key for your app. (optional)
    // 'clientKey'            : 'myClientKey',

    // The REST API key for your app. (optional)
    // 'restAPIKey'           : 'myRestAPIKey',

    // The JavaScript key for your app. (optional)
    // 'javascriptKey'        : 'myJavascriptKey',

    // The .NET key for your app. (optional)
    // 'dotNetKey'            : 'myDotNetKey',

    // The default behavior (GridStore) can be changed by creating an adapter class (see FilesAdapter.js)
    // 'filesAdapter'         : ...,

    // Configuration options for APNS and GCM push.
    // See the Push Notifications wiki entry https://github.com/ParsePlatform/parse-server/wiki/Push
    // 'push'                 : { ... },

    // Set to false to disable client class creation. Defaults to true
    'allowClientClassCreation': process.env.NODE_ENV !== 'production',

    // Configure support for 3rd party authentication. see https://github.com/ParsePlatform/parse-server/wiki/Parse-Server-Guide#oauth
    'oauth': {
      'twitter': {
        'consumer_key'        : process.env.consumer_key,
        'consumer_secret'     : process.env.consumer_secret,
      }
    },

    // Enable email verification
    'verifyUserEmails'        : process.env.mailAPIKey !== 'DISABLED',
    // The public URL of your app.
    // This will appear in the link that is used to verify email addresses and reset passwords.
    // Set the mount path as it is in serverURL
    'publicServerURL'         : `http://${hostname}${port ? `:${port}` : ''}${mount}`,

    // Your apps name. This will appear in the subject and body of the emails that are sent.
    'appName'                 : 'Paddock - Parse App',

    // The email adapter
    'emailAdapter': {
      'module'                : 'parse-server-simple-mailgun-adapter',
      'options': {
        // The address that your emails come from
        'fromAddress'         : process.env.mailFrom || 'from@yourmaildomain.com',
        // Your domain from mailgun.com
        'domain'              : process.env.mailDomain || 'yourmaildomain.com',
        // Your API key from mailgun.com
        'apiKey'              : process.env.mailAPIKey,
      }
    }

  }

}
