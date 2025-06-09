const {
	defineConfig
} = require('@vue/cli-service');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = defineConfig({
	transpileDependencies: true,

	devServer: {
		host: '0.0.0.0',
		port: 8081,
		open: true,
		https: false,
		hot: true,
		client: {
			overlay: {
				warnings: false,
				errors: true
			}
		},
		proxy: {
			'/api': {
				target: process.env.VUE_APP_BASE_API || 'http://localhost:8080',
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	},

	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	outputDir: 'dist',
	assetsDir: 'static',
	lintOnSave: false,
	productionSourceMap: false,

	configureWebpack: (config) => {
		const plugins = [
			new webpack.DefinePlugin({
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
				__VUE_OPTIONS_API__: JSON.stringify(true),
				__VUE_PROD_DEVTOOLS__: JSON.stringify(false)
			})
		];

		if (process.env.NODE_ENV === 'production') {
			plugins.push(
				new CompressionWebpackPlugin({
					test: /\.(js|css|html|svg)$/,
					threshold: 10240,
					deleteOriginalAssets: false
				})
			);
		}

		return {
			plugins
		};
	},

	chainWebpack: (config) => {
		if (process.env.NODE_ENV === 'production') {
			config.output.filename('static/js/[name].[contenthash:8].js').end();
			config.output.chunkFilename('static/js/[name].[contenthash:8].js').end();
		}
	}
});