const path = require("path");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  let config = {
    entry: [
      "core-js/stable",
      "regenerator-runtime/runtime",
      "./src/index.js",
    ],
    module: {
      rules: [
        {
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
        {
          test: /\.css$/i,
          use: ["css-loader"],
        },
      ],
    },
    devtool: isDevelopment ? "source-map" : false,
    output: {
      path: path.resolve(__dirname, "../static/frontend"),
      filename: "main.js",
      publicPath: "/static/frontend/",
    },
    watch: isDevelopment,
    watchOptions: {
      ignored: /node_modules/,
    },
    optimization: {
      minimize: !isDevelopment,
    },
  };

  return config;
};
