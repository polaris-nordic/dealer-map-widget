const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    ...defaultConfig,
    entry: `./src/index.tsx`,
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    // We need to add a new rule to process `.ts` and `.tsx` files with `ts-loader
    /*module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                // Notice that this regex matches both `.ts` and `.tsx`
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            // You can specify any custom config
                            configFile: 'tsconfig.json',

                            // See note under "issues" for details
                            // Speeds up by skipping type-checking. You can still use TSC for that.
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        ...defaultConfig.resolve,
        // modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        // modules: ['./', 'node_modules'],
        extensions: [ '.ts', '.tsx', ...(defaultConfig.resolve ? defaultConfig.resolve.extensions || ['.js', '.jsx'] : [])],
    },*/
    resolve: {
        ...defaultConfig.resolve,
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        ...defaultConfig.output,
        filename: "index.js",
        path: path.resolve(__dirname, "build"),
    },
};
