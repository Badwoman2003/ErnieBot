// @see: https://zh-hans.eslint.org
module.exports = {
  // 设置为true表示该配置文件是根配置文件，ESLint将停止在父目录中查找其他配置文件。
  root: true,
  extends: [
    '@cc-devtools/eslint-config',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['vue'],
  overrides: [
    {
      files: ['vite.config.ts'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
    },
    {
      files: ['*.vue'],
      extends: ['plugin:vue/vue3-essential'],
      parser: 'vue-eslint-parser',
      rules: {
        'vue/multi-word-component-names': 'off',
        'import/no-unresolved': 'off',
        'vue/html-self-closing': 'off',
        'vue/html-indent': 'off',
        'vue/max-attributes-per-line': 'off',
      },
    },
  ],
  rules: {
    'no-console': 'warn',
    'max-classes-per-file': 'off',
    'no-continue': 'off',
    'no-multi-assign': 'off',
    '@typescript-eslint/no-loop-func': 'off',
    'no-await-in-loop': 'off',
    'prettier/prettier': 'error',
  },
};
