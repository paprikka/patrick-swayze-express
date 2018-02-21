const path = require( 'path' )
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' )

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'index.js',
        library: 'pse',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    devtool: 'source-map',
    plugins: [
        new UglifyJsPlugin( {
            sourceMap: true,
            cache: true,
        } ),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env' ],
                    },
                },
            },
        ],
    },
    externals: /^rxjs\/*./i,
}
