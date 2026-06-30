#!/usr/bin/env node
/**
 * Postinstall script to patch react-native-css-interop babel config
 *
 * The package hardcodes "react-native-worklets/plugin" which conflicts
 * with react-native-reanimated 3.x. This makes it optional.
 */

const fs = require('fs');
const path = require('path');

const patchedCode = `module.exports = function () {
  const plugins = [
    require("./dist/babel-plugin").default,
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "automatic",
        importSource: "react-native-css-interop",
      },
    ],
  ];

  // Use react-native-worklets plugin in reanimated 4 and later
  // For reanimated 3.x, use react-native-reanimated/plugin instead
  try {
    require.resolve("react-native-worklets/plugin");
    plugins.push("react-native-worklets/plugin");
  } catch (e) {
    // react-native-worklets not installed, skip
  }

  return { plugins };
};
`;

const filesToPatch = [
  'node_modules/react-native-css-interop/babel.js',
  'node_modules/nativewind/node_modules/react-native-css-interop/babel.js'
];

filesToPatch.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, patchedCode);
    console.log(`✓ Patched ${filePath}`);
  }
});

console.log('✓ Postinstall patches applied successfully');
