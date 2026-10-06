const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

module.exports = withNativewind(config);
