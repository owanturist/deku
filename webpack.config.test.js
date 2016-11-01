const path = require('path')

module.exports = {
    entry: [
        path.join(__dirname, 'testts', 'index.ts')
    ],
    output: {
        path: path.join(__dirname, '.tmp'),
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
        root: path.join(__dirname, 'testts'),
        extensions: ['', '.js', '.ts', '.jsx', '.tsx']
    },
    node: {
        fs: 'empty'
    }
};