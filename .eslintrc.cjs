module.exports = {
	extends: './node_modules/@companion-module/tools/eslint/main.cjs',
	overrides: [
		{
			files: ['*.ts'],
			rules: {
				'no-use-before-define': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
				'@typescript-eslint/camelcase': 'off',
				'@typescript-eslint/ban-ts-ignore': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'prettier/prettier': ['warn', { endOfLine: 'auto' }],
			},
		},
	],
}
