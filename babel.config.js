
    module.exports = function (api) {
      api.cache(true)
      return {
	"presets": [
		"@babel/preset-react",
		"@babel/preset-typescript"
	],
	"plugins": [
		[
			"module-resolver",
			{
				"extensions": [
					".js",
					".jsx",
					".es",
					".es6",
					".mjs",
					".ts",
					".tsx",
				],
				"alias": {
					"@assets": "./src/assets",
					"@components": "./src/components",
					"@hooks": "./src/hooks",
					"@utils": "./src/utils",
					"@root": "./src",
					"@core": "./src/core",
					"@constants": "./src/constants",
					"@type": "./src/type",
					'@material-ui/core': '@mui/material',
    			'@material-ui/icons': '@mui/icons-material',
    			'@material-ui/styles': '@mui/styles',
				}
			}
		],
		[
			"@babel/plugin-proposal-decorators",
			{
				"legacy": true
			}
		],
		"@babel/plugin-proposal-nullish-coalescing-operator",
		"@babel/plugin-proposal-optional-chaining",
		"@babel/plugin-proposal-class-properties",
		"@babel/plugin-proposal-object-rest-spread"
	]
}
    }
    