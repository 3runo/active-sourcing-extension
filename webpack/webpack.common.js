const CopyPlugin = require('copy-webpack-plugin');
// const webpack = require('webpack');
const path = require('path');
const srcFolder = (str) => path.join(__dirname, '../src/' + str);
const dirFolder = (str) => path.join(__dirname, str);

module.exports = {
  entry: {
    popup: srcFolder('popup.tsx'),
    options: srcFolder('options.ts'),
    background: srcFolder('background.ts'),
    content_script: srcFolder('content_script.ts'),
  },
  output: {
    path: dirFolder('../dist/js'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svgx$/,
        use: [{ loader: '@svgr/webpack', options: { svgo: false } }],
        include: srcFolder('svg/'),
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    // exclude locale files in moment
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyPlugin([{ from: '.', to: '../' }], { context: 'public' }),
  ],
};
