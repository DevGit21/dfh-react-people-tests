export default [
    {
      ignores: ["node_modules/", "dist/", "build/"],
    },
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
        },
      },
      rules: {
        "no-unused-vars": "warn",
        "no-console": "warn",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
      },
    },
  ];
  