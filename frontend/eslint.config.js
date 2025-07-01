import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import { defineExpose } from 'vue';
import eslintConfigPrettier from 'eslint-config-prettier';
const vueRules = pluginVue.configs['flat/vue3-recommended'].rules;

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: { vue: pluginVue },
    rules: { ...vueRules }
  },
  eslintConfigPrettier,
  {
    // Ignora el propio archivo de configuración para evitar conflictos.
    ignores: ['eslint.config.js'],
  },
];
