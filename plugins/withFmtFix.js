const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Fix for fmt consteval issue with Xcode 26 / Clang 16+
// expo-sqlite 15.x uses op-sqlite which bundles the fmt library.
// fmt uses `consteval` which Clang 16 evaluates more strictly.
// Setting FMT_USE_CONSTEVAL=0 makes fmt use constexpr as fallback.
const FMT_FIX = `
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |build_config|
      build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'
      build_config.build_settings['OTHER_CFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'
    end
  end
end
`;

const withFmtFix = (config) =>
  withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');
      if (!contents.includes('FMT_USE_CONSTEVAL')) {
        contents += FMT_FIX;
        fs.writeFileSync(podfilePath, contents);
      }
      return config;
    },
  ]);

module.exports = withFmtFix;
