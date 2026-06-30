const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo config plugin to resolve duplicate libworklets.so from
 * react-native-reanimated and react-native-worklets.
 *
 * This keeps Reanimated's version and excludes the duplicate from worklets.
 */
const withExcludeDuplicateWorklets = (config) => {
  return withAppBuildGradle(config, (config) => {
    const { modResults } = config;
    let gradleContent = modResults.contents;

    // Add packagingOptions to exclude duplicate libworklets.so from react-native-worklets
    // Reanimated's version will be kept
    const packagingOptions = `
    packagingOptions {
        pickFirst '**/libworklets.so'
    }
`;

    // Insert packagingOptions inside android { } block
    if (!gradleContent.includes('pickFirst')) {
      gradleContent = gradleContent.replace(
        /android\s*\{/,
        `android {\n${packagingOptions}`
      );
      modResults.contents = gradleContent;
    }

    return config;
  });
};

module.exports = withExcludeDuplicateWorklets;
