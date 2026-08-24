import config, { reactConfig } from '@iobroker/eslint-config';

export default [
    ...config,
    ...reactConfig,
    {
        languageOptions: {
            parserOptions: {
                projectService: { allowDefaultProject: ['*.js', '*.mjs'] },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        ignores: ['build/', 'node_modules/', '.__mf__temp/', 'vite.config.*', 'src/index.js', 'src/translations.js'],
    },
    {
        rules: {
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-param-description': 'off',
            'jsdoc/require-returns-description': 'off',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
        },
    },
];
