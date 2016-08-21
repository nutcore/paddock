module.exports = function(nwb) {

  return {
    'type': 'react-app',

    'webpack': {
      'define': {
        'ENV'               : JSON.stringify(process.env.NODE_ENV)
      },

      'loaders': {
        // Adds a custom babel loader
        // https://github.com/insin/nwb/blob/master/src/createWebpackConfig.js#L135
        // due to default OS temp dir not working in Docker
        'babel': {
          'test'            : /\.js$/,
          'loader'          : require.resolve('babel-loader'),
          'exclude'         : /node_modules/,
          'query': {
            // Don't look for .babelrc files
            'babelrc'       : false,
            // Cache transformations to the filesystem (in default OS temp dir)
            'cacheDirectory': '/tmp/'
          }
        }
      },

      'babel': {
        'cherryPick'        : 'lodash'
      },

    },

  }
}
