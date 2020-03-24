const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const glob = require('glob');
const result = dotenv.config();
const { parsed: envs } = result;

console.log("webpack.config.js envs are " + JSON.stringify(envs))

const nodeEnv = envs.NODE_ENV;
const isProduction = nodeEnv !== 'development';

console.log("setting up env for : " + nodeEnv);


function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
  name: "styles",
  entry: ["./src/style/styles.js"],
  output: {
    filename: '[name]',
    path: path.resolve('bin'),
    publicPath: '/'
  }, 
  optimization: {
  	namedModules: true,
  	namedChunks: true,
  	moduleIds: 'named',
  	chunkIds: 'named', 
  	portableRecords: true,
    splitChunks: {
    	chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {loader: "babel-loader"}
        ]
      },
      {
        test: /\.s?(a|c)ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProduction,
              publicPath: (resourcePath, context) => {
                // publicPath is the relative path of the resource to the context
                // e.g. for ./css/admin/main.css the publicPath will be ../../
                // while for ./css/main.css the publicPath will be ../
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            },
          },
          {loader: 'css-loader'},
          {loader: 'sass-loader'}
        ]
      },

    ]
  },
  watch: false,
  watchOptions: {
    ignored: ['node_modules/*']
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },
  plugins:[
    new MiniCssExtractPlugin({
      splitChunks: false,  
      filename: '[name].css',
      chunkFileName: '[id].css',
      ignoreOrder: false,
    })
  ],
  mode: nodeEnv
}