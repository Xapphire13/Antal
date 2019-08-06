const ReactWithStyles = require("eslint-plugin-react-with-styles/lib/index");

module.exports = {
  plugins: ["prettier", "react-with-styles"],
  extends: ["airbnb-typescript", "plugin:prettier/recommended", "prettier/react"],
  env: { browser: true },
  rules: {
    ...ReactWithStyles.configs.recommended.rules,
    "prettier/prettier": ["error", { singleQuote: true }],
    "no-use-before-define": "off",
    "no-shadow": "warn",
    "no-restricted-syntax": "off",
    "no-continue": "off",
    "no-param-reassign": "warn",
    "@typescript-eslint/indent": "off"
  }
}