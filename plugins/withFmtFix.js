const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Fix for the fmt "consteval" compile error with Xcode 16+/26 (strict consteval).
//
// React Native 0.76 (via RCT-Folly) pulls in fmt 11.0.2. In fmt's base.h the
// macro FMT_USE_CONSTEVAL is *unconditionally* (re)defined based on the compiler's
// own feature detection -- there is NO `#ifndef FMT_USE_CONSTEVAL` guard:
//
//   #elif defined(__cpp_consteval)
//   #  define FMT_USE_CONSTEVAL 1
//
// Xcode 26's clang defines __cpp_consteval, so the header forces it to 1 and
// FMT_CONSTEVAL expands to `consteval`. Because the header ignores any value we
// pass in, a `-DFMT_USE_CONSTEVAL=0` compiler flag (OTHER_CPLUSPLUSFLAGS /
// GCC_PREPROCESSOR_DEFINITIONS) has no effect at all.
//
// The only reliable fix is to patch the downloaded fmt source so it forces
// FMT_USE_CONSTEVAL to 0 right before FMT_CONSTEVAL is derived from it. We do
// that from the Podfile post_install hook, which runs AFTER the fmt pod has been
// downloaded into the Pods sandbox.
const FMT_FIX_CODE = `
    # withFmtFix: force fmt's FMT_USE_CONSTEVAL off (see plugins/withFmtFix.js).
    fmt_base_h = File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base_h)
      fmt_contents = File.read(fmt_base_h)
      unless fmt_contents.include?('withFmtFix')
        fmt_contents = fmt_contents.sub(
          "#if FMT_USE_CONSTEVAL\\n#  define FMT_CONSTEVAL consteval",
          "#undef FMT_USE_CONSTEVAL // withFmtFix\\n#define FMT_USE_CONSTEVAL 0\\n#if FMT_USE_CONSTEVAL\\n#  define FMT_CONSTEVAL consteval"
        )
        File.write(fmt_base_h, fmt_contents)
      end
    end
`;

const ANCHOR = 'react_native_post_install(';
const MARKER = 'withFmtFix';

const withFmtFix = (config) =>
  withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');
      if (!contents.includes(MARKER)) {
        if (!contents.includes(ANCHOR)) {
          throw new Error('withFmtFix: could not find react_native_post_install in Podfile');
        }
        // Insert our patch code inside the existing post_install block, right
        // after the react_native_post_install(...) call closes. CocoaPods does
        // not allow a second post_install hook, so we must reuse this one.
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
