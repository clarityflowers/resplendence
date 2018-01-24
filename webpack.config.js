const path = require('path');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const webpack = require('webpack');


module.exports = {
  bail: true,
  entry: {
    "index": path.resolve(__dirname, "src", "resplendent.js"),
    "loader": path.resolve(__dirname, "src", "loader.js"),
    "plugin": path.resolve(__dirname, "src", "plugin.js")
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
    chunkFilename: '[chunkhash:8].chunk.js',
    library: 'resplendence',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        include: path.resolve(__dirname, "src"),
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
      },
      {
        test: /\.(js|jsx|mjs)$/,
        loader: require.resolve('babel-loader'),
        include: path.resolve(__dirname, "src"),
        options: {
          compact: true
        },
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },        
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: true,
    }),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  target: "node"
}