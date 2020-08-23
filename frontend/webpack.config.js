module.exports = {
  entry: {
    main: ["core-js/stable", "regenerator-runtime/runtime", "src/main.js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
};
