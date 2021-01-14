
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
				"alias": {
					"@type": "./src/type",
					"@constants": "./src/constants",
					"@components": "./src/components",
					"@assets": "./src/assets",
					"@screens": "./src/screens",
					"@navigation": "./src/navigation",
					"@utils": "./src/utils",
					"@views": "./src/views",
					"@machine": "./src/machine",
					"@store": "./src/machine/store",
					"@core": "./src/core",
					"@hooks": "./src/hooks",
					"@root": "./src",
					"@storybookComponents": "./docs/components"
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
		"@babel/plugin-proposal-object-rest-spread",
		"@babel/plugin-proposal-numeric-separator"
	]
}
    }
    