'use strict';
const webpack = require('webpack');
module.exports = {
    
    entry: './demo/index.js',
    output: {
        path: __dirname,
        filename: 'bundle.js',
        // publicPath: 'pathOrUrlWhenProductionBuild'
    },
    optimization: {
      minimize: false,
    },
    // plugins:[
    //   new webpack.optimize.UglifyJsPlugin({
    //     include: /\.js$/,
    //     minimize:false
    //   })
    // ],
    module: {
        rules: [
            {
              test: /\.js$/,
              use:[
                {
                  loader: 'babel-loader',
                  query: {
                    plugins: [
                      ['transform-react-jsx', {pragma: 'Lin.createElement'}],
                      'transform-class-properties'
                    ]
                  }
                }
              ],
              // loader: 'babel-loader',
              // query: {
              //   plugins: [
              //     ['transform-react-jsx', {pragma: 'Lin.createElement'}],
              //     'transform-class-properties'
              //   ]
              // }
            }
          ],
    },
};
