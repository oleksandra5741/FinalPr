const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('styles/[name].css');

module.exports = {
    entry: [
        './js/plugins.js',
        './js/vendor/jquery-3.2.1.min.js',
        './js/main.js',
        './css/bootstrap.min.css',
        './css/main.css',
        './css/normalize.css',
    ],
    devtool: 'inline-source-map',
    devServer: {
         contentBase: './dist'
   },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader'])
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "file-loader?name=img/[name].[ext]"
            }
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "./vendor/jquery-3.2.1.min.js",
            jQuery: "./vendor/jquery-3.2.1.min.js",
            "window.jQuery": "./vendor/jquery-3.2.1.min.js"
        }),
        extractCSS
    ]
};