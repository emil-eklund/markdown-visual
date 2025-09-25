const path = require("path");
const webpack = require("webpack");
const { PowerBICustomVisualsWebpackPlugin, LocalizationLoader } = require("powerbi-visuals-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ExtraWatchWebpackPlugin = require("extra-watch-webpack-plugin");
const powerbiApi = require("powerbi-visuals-api");

const pbivizPath = "./pbiviz.json";
const capabilitiesPath = "./capabilities.json";
const pbivizFile = require(path.resolve(__dirname, "pbiviz.json"));
const capabilities = require(path.resolve(__dirname, "capabilities.json"));

const pluginLocation = "./.tmp/precompile/visualPlugin.ts";
const visualSourceLocation = "../../src/visual";

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";
    const statsFileName = isProduction ? "webpack.statistics.prod.html" : "webpack.statistics.dev.html";

    return {
        entry: {
            "visual.js": pluginLocation
        },
        target: "web",
        mode: isProduction ? "production" : "development",
        devtool: "source-map",
        optimization: {
            minimize: isProduction
        },
        performance: {
            maxEntrypointSize: 1024000,
            maxAssetSize: 1024000
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: false
                            }
                        }
                    ]
                },
                {
                    test: /(\.less)|(\.css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "less-loader",
                            options: {
                                lessOptions: {
                                    paths: [path.resolve(__dirname, "node_modules")]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|ttf|eot|png|jpe?g|gif|svg)$/i,
                    type: "asset/inline"
                },
                {
                    test: /powerbiGlobalizeLocales\.js$/,
                    loader: LocalizationLoader
                }
            ]
        },
        externals: {
            "powerbi-visuals-api": "null"
        },
        resolve: {
            alias: {
                fakeDefine: path.resolve(__dirname, "fakeDefine.js")
            },
            extensions: [".tsx", ".ts", ".jsx", ".js", ".json"]
        },
        output: {
            clean: true,
            path: path.join(__dirname, ".tmp", "drop"),
            publicPath: "assets",
            filename: "[name]",
            library: pbivizFile.visual.guid,
            libraryTarget: "var"
        },
        devServer: {
            static: {
                directory: path.join(__dirname, ".tmp", "drop"),
                publicPath: "/assets/"
            },
            compress: true,
            port: 8080,
            hot: false,
            server: {
                type: "https"
            },
            headers: {
                "access-control-allow-origin": "*",
                "cache-control": "public, max-age=0"
            },
            devMiddleware: {
                writeToDisk: true
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "visual.css",
                chunkFilename: "[id].css"
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: path.join(__dirname, statsFileName),
                openAnalyzer: false
            }),
            new PowerBICustomVisualsWebpackPlugin({
                ...pbivizFile,
                capabilities,
                visualSourceLocation,
                pluginLocation,
                apiVersion: powerbiApi.version,
                capabilitiesSchema: powerbiApi.schemas.capabilities,
                dependenciesSchema: powerbiApi.schemas.dependencies,
                devMode: !isProduction,
                generatePbiviz: true,
                generateResources: isProduction,
                modules: true,
                packageOutPath: path.join(__dirname, "dist")
            }),
            new ExtraWatchWebpackPlugin({
                files: [pbivizPath, capabilitiesPath]
            }),
            new webpack.WatchIgnorePlugin({
                paths: [
                    path.join(__dirname, ".tmp", "precompile", "visualPlugin.ts"),
                    path.join(__dirname, ".tmp", "drop", "*.*")
                ]
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        ]
    };
};
