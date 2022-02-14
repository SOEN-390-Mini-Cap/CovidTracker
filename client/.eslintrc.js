module.exports = {
    env: {
        node: true,
        es6: true,
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    extends: ["react-app", "eslint:recommended", "plugin:prettier/recommended"],
    ignorePatterns: ["libs/", "src/@core", "build/", "node_modules/"],
};
