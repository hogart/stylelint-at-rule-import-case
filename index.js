'use strict';

const stylelint = require('stylelint');
const ruleName = 'at-rule-import-case/at-rule-import-case';
const messages = stylelint.utils.ruleMessages(ruleName, {
    rejectedPattern: 'File name should follow given pattern in import statements',
    camelCase: 'File name should be in camelCase in import statements',
    'kebab-case': 'File name should be in kebab-case in import statements',
    PascalCase: 'File name should be in PascalCase in import statements',
    snake_case: 'File name should be in snake_case in import statements',
});
const patterns = {
    camelCase: /^([a-z]+[A-Z]+\w+)+/,
    'kebab-case': /^([a-z]+)($|-[a-z]*)/,
    PascalCase: /^[A-Z][a-z]+(?:[A-Z][a-z]+)*/,
    snake_case: /^([a-z]+)($|_[a-z]*)/,
};

function stripFilename(fileName) {
    let stripped = fileName.replace(/^_/, '');
    stripped = stripped.replace(/\.(css|scss|sass|styl|sss)$/, '');

    return stripped;
}

function isValidRegexp(reString) {
    try {
        new RegExp(reString);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports = stylelint.createPlugin(ruleName, (enabled, options) =>
    (root, result) => {
        const opts = options || {};
        const hasOptions = Object.getOwnPropertyNames(opts).length > 0;
        const validOptions = stylelint.utils.validateOptions(result, ruleName, {
            actual: enabled,
            possible: [true, false],
        }, {
            actual: options,
            possible: {
                case: ['camelCase', 'kebab-case', 'PascalCase', 'snake_case'],
                pattern (value) {
                    return isValidRegexp(value);
                },
            },
            optional: true
        });

        function checkForImportStatement(atRule) {
            if (atRule.name !== 'import' || !enabled) {
                return;
            }

            const params = atRule.params.replace(/['"]/g, '');
            let fileName = '';
            let importPathParts = [];

            if (params.indexOf('/') > -1) {
                importPathParts = params.split('/');
                fileName = importPathParts[importPathParts.length - 1];
            } else {
                fileName = params;
            }

            const casePattern = patterns[opts.case];

            if (hasOptions) {
                if (casePattern) {
                    if (!casePattern.test(stripFilename(fileName))) {
                        stylelint.utils.report({
                            ruleName,
                            result,
                            node: atRule,
                            message: messages[opts.case],
                        });
                    }
                } else if (opts.pattern) {
                    const pattern = new RegExp(opts.pattern);

                    if (!pattern.test(fileName)) {
                        stylelint.utils.report({
                            ruleName,
                            result,
                            node: atRule,
                            message: messages.rejectedPattern,
                        });
                    }
                }
            }
        }

        if (!validOptions) {
            return;
        }

        root.walkAtRules(checkForImportStatement);
    }
);

module.exports.ruleName = ruleName;
module.exports.messages = messages;
module.exports.patterns = patterns;
