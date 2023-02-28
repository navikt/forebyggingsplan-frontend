module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
        "jest/globals": true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "plugin:jsx-a11y/recommended",
        "next/core-web-vitals",
        "prettier", // Add "prettier" last. This will turn off eslint rules conflicting with prettier. This is not what will format our code.
    ],
    rules: {
        "@typescript-eslint/no-unused-vars": "error",
    },
    overrides: [
        {
            files: [
                "**/__tests__/**/*.[jt]s?(x)",
                "**/?(*.)+(spec|test).[jt]s?(x)",
            ],
            extends: ["plugin:testing-library/react"],
            rules: {
                "testing-library/no-debugging-utils": "warn",
            },
        },
        {
            files: ["sanity-studio/*"],
            extends: ["sanity/react", "sanity/typescript", "prettier"],
            rules: {
                "no-process-env": "off",
            },
        },
    ],
    ignorePatterns: ["*.module.css"],
};
