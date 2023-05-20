module.exports = {
	extends: [
		"react-app",
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:import/recommended",
		"plugin:jsx-a11y/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/typescript",
		// This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
		// Make sure it's always the last config, so it gets the chance to override other configs.
		"eslint-config-prettier",
	],
	settings: {
		react: {
			version: "detect",
		},
		"import/resolver": {
			node: {
				// paths: ["src"],
				extensions: [".js", ".jsx", ".ts", ".tsx"],
			},
			typescript: {},
		},
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
	},
	rules: {
		"react/react-in-jsx-scope": "off",
		"import/no-anonymous-default-export": [
			"error",
			{
				allowArray: false,
				allowArrowFunction: false,
				allowAnonymousClass: false,
				allowAnonymousFunction: false,
				allowCallExpression: true, // The true value here is for backward compatibility
				allowNew: false,
				allowLiteral: true,
				allowObject: false,
			},
		],
		"@typescript-eslint/no-explicit-any": "off",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"jsx-a11y/label-has-associated-control": "off",
		"react/display-name": "off",

		"react/prop-types": "off",
		"@typescript-eslint/no-empty-function": "off",
		"jsx-a11y/tabindex-no-positive": "off",
		"no-empty": "off",
		"no-extra-boolean-cast": "off",
		"react/no-unescaped-entities": "off",
		"jsx-a11y/click-events-have-key-events": "off",
		"jsx-a11y/no-static-element-interactions": [
			"error",
			{
				handlers: ["onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"],
				allowExpressionValues: true,
			},
		],
		"jsx-a11y/no-noninteractive-element-interactions": "off",
		"jsx-a11y/no-noninteractive-tabindex": "off",
		// "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
	},
};
