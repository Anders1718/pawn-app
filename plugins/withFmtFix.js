const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Fix for fmt consteval issue with Xcode 26 / Clang 16+
// expo-sqlite 15.x uses op-sqlite which bundles the fmt library.
// fmt uses `consteval` which Clang 16 evaluates more strictly.
// Setting FMT_USE_CONSTEVAL=0 makes fmt use constexpr as fallback.
// Injected inside the existing post_install block to avoid the
// "Specifying multiple post_install hooks is unsupported" CocoaPods error.
const FMT_FIX_CODE = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'
        build_config.build_settings['OTHER_CFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'
      end
    end
`;

const ANCHOR = 'react_native_post_install(';

const withFmtFix = (config) =>
  withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');
      if (!contents.includes('FMT_USE_CONSTEVAL')) {
        if (!contents.includes(ANCHOR)) {
          throw new Error('withFmtFix: could not find react_native_post_install in Podfile');
        }
        // Find the end of the react_native_post_install(...) call and insert after it
        const anchorIndex = contents.indexOf(ANCHOR);
        const closingParen = contents.indexOf('\n    )\n', anchorIndex);
        if (closingParen === -1) {
          throw new Error('withFmtFix: could not find closing ) of react_native_post_install');
        }
        const insertAt = closingParen + '\n    )\n'.length;
        contents = contents.slice(0, insertAt) + FMT_FIX_CODE + contents.slice(insertAt);
        fs.writeFileSync(podfilePath, contents);
      }
      return config;
    },
  ]);

module.exports = withFmtFix;
