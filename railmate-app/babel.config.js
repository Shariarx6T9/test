module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // NativeWind v4 — REQUIRED: transforms className props on RN primitives.
      // Without this, className is silently dropped and zero styles are applied.
      require("react-native-css-interop/dist/babel-plugin").default,
      // NativeWind v4 — REQUIRED: overrides JSX import source so that the
      // css-interop runtime can inject StyleSheet values from className at
      // component instantiation time.
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
          importSource: "react-native-css-interop",
        },
      ],
      // Must remain last per Reanimated docs.
      "react-native-reanimated/plugin",
    ],
  };
};
