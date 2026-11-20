import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

const recommended = firebaseRulesPlugin.configs['flat/recommended'];

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*'],
  },
  {
    ...recommended,
    files: ['**/firestore.rules', '**/DRAFT_firestore.rules'],
  },
];
