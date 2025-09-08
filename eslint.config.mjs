import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default generateEslintConfig({
	enableTypescript: true,
	commonRules: {
		'n/no-unpublished-import': [
			'error',
			{
				allowModules: [],
				convertPath: null,
			},
		],
	},
})
