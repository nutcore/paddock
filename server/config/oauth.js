module.exports = function(params, env) {
  var hostname    = params.hostname;

  return [
    {
      'name'          : 'twitter',
      // id = secret
      'client_id'     : process.env.consumer_key,
      'client_secret' : process.env.consumer_secret,
      // Define the grant_url where to exchange Authorisation codes for tokens
      'grant_url'     : 'https://api.twitter.com/oauth/access_token',
      // Restrict the callback URL to a delimited list of callback paths
      'domain'        : `${hostname}`
    }
  ];

}
