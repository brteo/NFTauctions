module.exports = {
	env: {
		node: true,
		es6: true,
		'jest/globals': true
	},
	extends: ['eslint:recommended', 'airbnb', 'prettier'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		allowImportExportEverywhere: false,
		codeFrame: false
	},
	plugins: ['prettier', 'jest'],
	rules: {
		'prettier/prettier': ['error'],
		'max-len': ['error', { code: 140, ignoreComments: true }],
		'no-unused-vars': ['warn', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
		'prefer-template': ['off']
	}
};
