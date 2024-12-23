// vim: ts=4 sts=4 sw=4
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "ecse4750-utils/MVnew": true,
        "ecse4750-utils/webgl-utils": true
    },
    "extends": "eslint:recommended",
    "globals": {
        Stats: false,
        dat: false
    },
    "parserOptions": {
        "ecmaVersion": 2015
    },
    "plugins": ["ecse4750-utils"],
    "rules": {
        "indent": ["error", 2, {
            "SwitchCase": 1,
            "VariableDeclarator": {"var": 2, "let": 2, "const": 3},
            "FunctionExpression": {"parameters": "first"},
            "CallExpression": {"arguments": "first"},
            "ArrayExpression": "first",
            "ObjectExpression": "first",
        }],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "no-console": ["off"],
        "accessor-pairs": ["warn"],
        "consistent-return": ["error"],
        "eqeqeq": ["error"],
        "no-else-return": ["error"],
        "no-throw-literal": ["error"],
        "space-in-parens": ["error", "never"],
    }
};
