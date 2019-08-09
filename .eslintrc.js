const ReactWithStyles = require("eslint-plugin-react-with-styles/lib/index");

module.exports = {
  plugins: ["prettier", "react-with-styles", "react-hooks"],
  extends: ["airbnb-typescript", "plugin:prettier/recommended", "prettier/react"],
  env: { browser: true },
  rules: {
    ...ReactWithStyles.configs.recommended.rules,
    "@typescript-eslint/indent": "off",
    "no-continue": "off",
    "no-param-reassign": "warn",
    "no-restricted-syntax": "off",
    "no-shadow": "warn",
    "no-use-before-define": "off",
    "prettier/prettier": ["error", { singleQuote: true }],
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
  }
}