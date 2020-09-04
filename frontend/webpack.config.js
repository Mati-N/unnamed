module.exports = (env, argv) => {
  let config = {
    entry: {
      main: ["core-js/stable", "regenerator-runtime/runtime", "src/main.js"],

      vendor: [
        "react",
        "react-router-dom",
        "react-dom",
        "@apollo/client",
        "graphql",
        "react-spring",
      ]
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
    devtool: ((argv.mode == 'development') ?
      'source-map' : false),
    output: {
      publicPath: "/static/frontend/",
    },
    watch: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    optimization: {
      minimize: true,
    }
  }

  return config;
};