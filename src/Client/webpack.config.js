var path = require("path");
var webpack = require("webpack");
var fableUtils = require("fable-utils");

function resolve(filePath) {
    return path.join(__dirname, filePath)
}

var babelOptions = fableUtils.resolveBabelOptions({
    presets: [
        ["env", {
            "targets": {
                "browsers": ["last 2 versions"]
            },
            "modules": false
        }]
    ],
    plugins: ["transform-runtime"]
});


var isProduction = process.argv.indexOf("-p") >= 0;
var port = process.env.SUAVE_FABLE_PORT || "8085";
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");

module.exports = {
    devtool: "source-map",
    entry: resolve('./Client.fsproj'),
    mode: isProduction ? "production" : "development",
    output: {
        path: resolve('./public/js'),
        publicPath: "/js",
        filename: "bundle.js"
    },
    resolve: {
        symlinks: false,
        modules: [resolve("../../node_modules/")]
    },
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://localhost:' + port,
                changeOrigin: true
            },
            '/socket/*': {
                target: 'http://localhost:' + port,
                ws: true
            }
        },
        contentBase: "./public",
        hot: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.fs(x|proj)?$/,
                use: {
                    loader: "fable-loader",
                    options: {
                        babel: babelOptions,
                        define: isProduction ? [] : ["DEBUG"]
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                }
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader",
                    options: {
                        javascriptEnabled: true
                    }
                }]
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    plugins: isProduction ? [] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};
