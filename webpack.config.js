var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');


module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/client.js" ,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }
      , {
          test: /\.sass$/,
          loaders: ['style', 'css', 'sass']
      },
       { test: /\.(jpe?g|png|gif|svg)$/i, loaders: [ 'url?limit=10000', 'img?minimize' ] }
      // { test: /\.png$/, loader: "url-loader?limit=100000" },
      // { test: /\.jpg$/, loader: "file-loader" }
      ]

  },
  output: {
    path: __dirname + "/src/",
    filename: "client.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
  sassLoader: {
    includePaths: [ path.resolve(__dirname, "./src/sass")]
  },
  imagemin: {
    gifsicle: { interlaced: false },
    jpegtran: {
      progressive: true,
      arithmetic: false
    },
    optipng: { optimizationLevel: 5 },
    pngquant: {
      floyd: 0.5,
      speed: 2
    },
    svgo: {
      plugins: [
        { removeTitle: true },
        { convertPathData: false }
      ]
    }
  },
  devServer: {

  }
};
