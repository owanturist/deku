const path = require('path')

module.exports = {
    entry: [
        path.join(__dirname, 'src', 'index.ts')
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts(|x)$/,
                loader: 'awesome-typescript',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        root: path.join(__dirname, 'src'),
        extensions: ['', '.js', '.ts', '.jsx', '.tsx']
    }
};
