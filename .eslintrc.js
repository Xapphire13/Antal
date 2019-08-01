module.exports = {
  plugins: ["prettier"],
  extends: ["airbnb-typescript", "plugin:prettier/recommended", "prettier/react"],
  env: { browser: true },
  rules: {
    "prettier/prettier": ["error", { singleQuote: true }],
    "no-use-before-define": "off",
    "no-shadow": "warn",
    "no-restricted-syntax": "off",
    "no-continue": "off",
    "no-param-reassign": "warn"
  }
}