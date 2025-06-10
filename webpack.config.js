const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: {
            app: './assets/js/app.js',
            styles: [
                './node_modules/bootstrap/dist/css/bootstrap.min.css',
                './node_modules/bootstrap-icons/font/bootstrap-icons.css',
                './assets/css/styles.css'
            ],
            vendor: [
                'jquery',
                'bootstrap'
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist/assets'),
            filename: 'js/[name].bundle.js',
            clean: true,
            publicPath: '/assets/'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        } : {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !isProduction
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]'
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/[name].css'
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                'window.$': 'jquery',
                bootstrap: 'bootstrap'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(argv.mode)
            }),
            new CopyPlugin({
                patterns: [
                    { 
                        from: 'assets/fonts',
                        to: 'fonts'
                    },
                    { 
                        from: 'assets/images',
                        to: 'images'
                    },
                    {
                        from: 'index.html',
                        to: '../index.html'
                    },
                    {
                        from: 'manifest.json',
                        to: '../manifest.json'
                    }
                ]
            })
        ],
        resolve: {
            alias: {
                'jquery': 'jquery',
                'bootstrap': 'bootstrap'
            }
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
                publicPath: '/'
            },
            compress: true,
            port: 8080,
            hot: true,
            historyApiFallback: true,
            open: true
        }
    };
}; 