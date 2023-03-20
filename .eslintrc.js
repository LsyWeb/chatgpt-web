// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index'], //需要忽略的组件名
      },
    ],
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        trailingComma: 'all',
      },
    ],
  },
  plugins: ['prettier'],
};
