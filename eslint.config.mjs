import globals from "globals";

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      semi: "off",
      "prefer-const": "error",
    },
  },
  eslintPluginPrettierRecommended,
];
