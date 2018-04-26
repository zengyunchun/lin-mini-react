// let webpack = require('webpack')

// module.exports = {
//     entry: './demo/index.js',
    
// }
'use strict';

const webpack = require('webpack');

module.exports = {
    entry: './demo/index.js',
    output: {
        path: __dirname,
        filename: 'bundle.js',
        // publicPath: 'pathOrUrlWhenProductionBuild'
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              loader: 'babel-loader',
              query: {
                plugins: [
                  ['transform-react-jsx', {pragma: 'Lin.createElement'}],
                  'transform-class-properties'
                ]
              }
            }
          ],
    },
};
