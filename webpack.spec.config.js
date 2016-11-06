const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'entry-spec'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'spec.js'
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
    },
    node: {
        fs: 'empty'
    }
};
