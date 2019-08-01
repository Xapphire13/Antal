module.exports = {
  plugins: ["prettier"],
  extends: ["airbnb-typescript", "plugin:prettier/recommended", "prettier/react"],
  env: { browser: true },
  rules: {
    "prettier/prettier": ["error", { singleQuote: true }]
  }
}