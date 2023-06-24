module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript', 'next'],
  // use next/core-web-vitals to error on a number of rules
  // that are warnings by default if they affect Core Web Vitals
  // extends: ['next', 'next/core-web-vitals'],
  env: {
    node: true,
    browser: true,
  },
  globals: {
    REACT_APP_ENV: true,
  },
  rules: {
    'import/no-anonymous-default-export': 'off',
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/dot-location": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/dot-notation": "error",
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/explicit-function-return-type": "off"
  },
}
