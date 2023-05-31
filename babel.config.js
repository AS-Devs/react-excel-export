module.exports = {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["last 2 versions"],
          },
        },
      ],
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: ["@babel/plugin-transform-runtime"]
  };
  