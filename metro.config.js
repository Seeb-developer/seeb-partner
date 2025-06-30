const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// Get base config
const defaultConfig = getDefaultConfig(__dirname);

// Custom config you may want to add
const customConfig = {
  // Any custom config can go here
};

// Merge default + custom
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// Wrap the merged config with Reanimated config
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
