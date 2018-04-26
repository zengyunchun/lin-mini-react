// let webpack = require('webpack')

// module.exports = {
//     entry: './demo/index.js',
    
// }
'use strict';

const webpack = require('webpack');

module.exports = {
    entry: './demo/index.js',
    context: path.resolve(__dirname),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        // publicPath: 'pathOrUrlWhenProductionBuild'
    },
    module: {
        loaders: [
            {
              test: /\.js$/,
              loader: 'babel',
              query: {
                plugins: [
                  ['transform-react-jsx', {pragma: 'Dilithium.createElement'}],
                  'transform-class-properties'
                ]
              }
            }
          ],
        rules: [
        ]
    },
    resolve: {
    },
    devtool: 'source-map',
    plugins: [
    ]
};
