var parse     = require('./parse');
var oauth     = require('./oauth');

module.exports = {

  is: function(env) {
    return process.env.NODE_ENV === env;
  },

  isnt: function(env) {
    return !this.is(env);
  },

  parse: function(params) {
    return parse(params, this);
  },

  oauth: function(params) {
    return oauth(params, this);
  },

}
