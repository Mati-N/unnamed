module.exports = {
  entry: {
    main: ["core-js/stable", "regenerator-runtime/runtime", "src/main.js"],
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  optimization: {
    minimize: true
  }
};