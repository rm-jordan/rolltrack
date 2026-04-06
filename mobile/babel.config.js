module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "nativewind/babel"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "@rolltrack/shared": "../packages/shared/src/index.ts",
          },
          extensions: [".ios", ".android", ".native", ".tsx", ".ts", ".jsx", ".js", ".json"],
        },
      ],
    ],
  };
};
