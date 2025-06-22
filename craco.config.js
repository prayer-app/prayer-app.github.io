const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      // Customize webpack configuration here
      
      // Example: Add custom aliases
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      };

      // Customize output path and structure for build
      if (env === 'production') {
        webpackConfig.output.path = path.resolve(__dirname, 'dist');
        
        // Set public path to root for GitHub Pages
        webpackConfig.output.publicPath = '/';
        
        // Update asset filenames to use assets folder
        if (webpackConfig.optimization && webpackConfig.optimization.splitChunks) {
          webpackConfig.optimization.splitChunks.cacheGroups = {
            ...webpackConfig.optimization.splitChunks.cacheGroups,
            default: {
              ...webpackConfig.optimization.splitChunks.cacheGroups.default,
              filename: 'assets/js/[name].[contenthash].js',
            },
            vendor: {
              ...webpackConfig.optimization.splitChunks.cacheGroups.vendor,
              filename: 'assets/js/[name].[contenthash].js',
            },
          };
        }
        
        // Update CSS extraction
        const miniCssExtractPlugin = webpackConfig.plugins.find(
          plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
        );
        if (miniCssExtractPlugin) {
          miniCssExtractPlugin.options.filename = 'assets/css/[name].[contenthash].css';
          miniCssExtractPlugin.options.chunkFilename = 'assets/css/[name].[contenthash].css';
        }
        
        // Update JS output filenames
        webpackConfig.output.filename = 'assets/js/[name].[contenthash].js';
        webpackConfig.output.chunkFilename = 'assets/js/[name].[contenthash].js';
        
        // Update asset modules to use assets folder instead of static
        webpackConfig.module.rules.forEach(rule => {
          if (rule.oneOf) {
            rule.oneOf.forEach(oneOfRule => {
              // Fonts
              if (
                oneOfRule.test &&
                oneOfRule.test.toString().includes('woff') &&
                oneOfRule.type === 'asset/resource'
              ) {
                oneOfRule.generator = {
                  ...oneOfRule.generator,
                  filename: 'assets/fonts/[name][ext]'
                };
              }
              // Images
              if (
                oneOfRule.test &&
                (oneOfRule.test.toString().includes('png') || oneOfRule.test.toString().includes('svg')) &&
                oneOfRule.type === 'asset/resource'
              ) {
                oneOfRule.generator = {
                  ...oneOfRule.generator,
                  filename: 'assets/images/[name][ext]'
                };
              }
              // Handle SVG files specifically
              if (
                oneOfRule.test &&
                oneOfRule.test.toString().includes('svg') &&
                oneOfRule.type === 'asset/resource'
              ) {
                oneOfRule.generator = {
                  ...oneOfRule.generator,
                  filename: 'assets/images/[name][ext]'
                };
              }
              // For any asset/resource, replace static with assets in the output path
              if (oneOfRule.type === 'asset/resource') {
                if (oneOfRule.generator && oneOfRule.generator.filename) {
                  oneOfRule.generator.filename = oneOfRule.generator.filename.replace('static', 'assets');
                } else {
                  // Default to assets/media if not set
                  oneOfRule.generator = {
                    ...oneOfRule.generator,
                    filename: 'assets/media/[name][ext]'
                  };
                }
              }
            });
          }
        });

        // Also handle any plugins that might generate static assets
        webpackConfig.plugins.forEach(plugin => {
          if (plugin.constructor.name === 'CopyPlugin') {
            // Update CopyPlugin patterns if they exist
            if (plugin.options && plugin.options.patterns) {
              plugin.options.patterns.forEach(pattern => {
                if (pattern.to && pattern.to.includes('static')) {
                  pattern.to = pattern.to.replace('static', 'assets');
                }
              });
            }
          }
        });
      }

      return webpackConfig;
    },
  },
  
  // Optional: Customize Babel configuration
  babel: {
    presets: [],
    plugins: [],
  },
  
  // Optional: Customize PostCSS configuration
  style: {
    postcss: {
      plugins: [],
    },
  },
  
  // Optional: Customize Jest configuration
  jest: {
    configure: (jestConfig) => {
      return jestConfig;
    },
  },
  
  // Optional: Customize dev server configuration
  devServer: {
    port: 3000,
    open: true,
  },
}; 