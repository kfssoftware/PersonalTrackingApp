const webpack = require('webpack');
// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra
const {
  override,
  // fixBabelImports,
  addLessLoader,
  useEslintRc,
  addDecoratorsLegacy,
  useBabelRc,
} = require('customize-cra')
const Dotenv = require('dotenv-webpack');
// eslint config
const eslintConfig = require('./.eslintrc.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const useEslintConfig = configRules => config => {

  const updatedRules = config.module.rules.map(
    rule => {
      // Only target rules that have defined a `useEslintrc` parameter in their options
      if (rule.use && rule.use.some(use => use.options && use.options.useEslintrc !== void 0)) {
        const ruleUse = rule.use[0]
        const baseOptions = ruleUse.options
        const baseConfig = baseOptions.baseConfig || {}
        const newOptions = {
          useEslintrc: false,
          ignore: true,
          baseConfig: { ...baseConfig, ...configRules },
        }
        ruleUse.options = newOptions
        return rule

        // Rule not using eslint. Do not modify.
      } else {
        return rule
      }
    }
  )

  config.module.rules = updatedRules;
  return config;A
}

const useCopyWebPack = configRules => config => {
  config.plugins.push(
    new Dotenv()
  );
  config.plugins.push(
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  );
  config.externals = {
    ...config.externals
  }
  return config;
}

module.exports = override(
  addDecoratorsLegacy(),
  // useEslintRc(),
  addLessLoader({
    javascriptEnabled: true,
  }),
  // useEslintConfig(eslintConfig),
  useBabelRc(),
  useCopyWebPack()
)