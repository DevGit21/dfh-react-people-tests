import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import parserTypescript from '@typescript-eslint/parser';  // Correct import for the parser

export default [
  {
    ignores: ["node_modules/", "dist/", "build/"],  // Ignore these folders
  },
  {
    files: ["**/*.{ts,tsx}"],  // Apply these settings to TypeScript and TSX files
    languageOptions: {
      parser: parserTypescript,  // Set the TypeScript parser correctly
      parserOptions: {
        ecmaVersion: 2020,  // Allow modern JavaScript syntax
        sourceType: "module",  // Allow ES Modules
        ecmaFeatures: {
          jsx: true,  // Allow JSX syntax
        },
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,  // Use the @typescript-eslint plugin
      'react': eslintPluginReact,  // Use the react plugin
      'react-hooks': eslintPluginReactHooks,  // Use the react-hooks plugin
    },
    rules: {
      "no-unused-vars": "warn",  // Warn about unused variables
      "no-console": "warn",  // Warn about console statements
      "react/jsx-uses-react": "off",  // React 17 and newer doesn’t need `React` in scope
      "react/react-in-jsx-scope": "off",  // React 17 and newer doesn’t need `React` in scope
      '@typescript-eslint/no-unused-vars': 'warn',  // TypeScript-specific rule for unused variables
      '@typescript-eslint/explicit-module-boundary-types': 'off',  // Disable the rule for explicit return types
    },
  },
];
