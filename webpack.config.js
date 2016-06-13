
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');

var mod = {
  isDebug: function(){
    return process.env.NODE_ENV !== 'production';
  },

  getFile: function(){
    return this.isDebug() ? 'config.json' : 'config.online.json';
  },

  getConfig: function(){
    var o = fs.readFileSync('./' + this.getFile());
    return JSON.parse(o.toString());
  }
};
var config = mod.getConfig();

var providePlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  _: 'underscore',
  React: 'react',
  ReactDOM: 'react-dom'
});
var loaders = [
  'babel?presets[]=es2015&presets[]=react&presets[]=stage-1'
]
var plugins = [
  providePlugin
]

module.exports = {
    // entry: [
    //   'webpack-dev-server/client?http://0.0.0.0:3030',  // WebpackDevServer host and port
    //   'webpack/hot/only-dev-server',                    // "only" prevents reload on syntax errors
    //   './public/src/js/index.js'
    // ],
    entry: {
      index: './public/src/js/index.js',
      login: './public/src/js/login.js',
      reg: './public/src/js/reg.js',
      forget: './public/src/js/forget.js',
      reset: './public/src/js/reset.js'
    },
    output: {
        path: path.join(__dirname, 'public/build'),
        filename: '[name].js',
        chunkFilename: '[id].js',
        publicPath: publicPath
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: loaders
            },
            { test: /\.less$/, loader: 'style!css!less' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.(gif|jpg|png)\??.*$/, loader: 'url-loader?limit=10240&name=img/[name].[ext]'}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json'],
        //别名
        //alias: {
        //    'jquery': node_modules + '/jquery/jquery.min.js'
        //}
    },
    plugins: plugins
};
