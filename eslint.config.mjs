import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier/flat";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

// Every tsconfig in the repo, so typed rules see every file.
const project = ["./tsconfig.json"];

const typeScriptRules = {
  // Type and value imports from one module must share a line, so a module
  // is named exactly once per file and nothing drifts out of sync.
  "no-duplicate-imports": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-misused-promises": [
    "error",
    { checksVoidReturn: false },
  ],
  // Inline rather than separate, so a type import never counts as a second
  // import of a module already imported for its values.
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { prefer: "type-imports", fixStyle: "inline-type-imports" },
  ],
};

export default [
  {
    ignores: ["node_modules/", "dist/", "coverage/"],
  },
  ...vuePlugin.configs["flat/recommended"],
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { project },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: typeScriptRules,
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslintParser,
        project,
        extraFileExtensions: [".vue"],
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: typeScriptRules,
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
  },
  // Last, so it turns off every formatting rule above. Prettier owns
  // formatting, and two formatters would undo each other on every commit.
  prettierConfig,
];
