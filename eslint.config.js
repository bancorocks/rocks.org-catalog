import yml from 'eslint-plugin-yml';
import ymlParser from 'yaml-eslint-parser';

export default [
  {
    ignores: [
      // Dependencies
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      
      // Generated files
      '**/*.d.ts',
      '**/*.js.map',
      
      // Cache
      '.cache/**',
      '.temp/**',
      
      // Test fixtures
      '**/__fixtures__/**',
      '**/__mocks__/**',
      
      // Build output
      'lib/**',
      'out/**'
    ]
  },
  {
    files: ['catalog/**/*.yaml', 'catalog/**/*.yml'],
    languageOptions: {
      parser: ymlParser,
      parserOptions: {
        defaultYAMLVersion: '1.2'
      }
    },
    plugins: {
      yml
    },
    rules: {
      'yml/indent': ['error', 2, { indentBlockSequences: true }],
      'yml/no-empty-key': 'error',
      'yml/no-tab-indent': 'error',
      'yml/block-mapping-question-indicator-newline': 'off',
      'yml/block-mapping-colon-indicator-newline': 'off',
      'yml/block-sequence-hyphen-indicator-newline': 'off',
      
      // Desabilitar regras que podem conflitar com Backstage
      'yml/sort-keys': 'off',
      'yml/sort-sequence-values': 'off',
      'yml/plain-scalar': 'off',
      'yml/quotes': 'off' 
    }
  }
];