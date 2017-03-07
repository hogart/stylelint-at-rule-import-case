'use strict';

const ruleTester = require('stylelint-rule-tester');
const atRuleImportCase = require('../index');

const messages = atRuleImportCase.messages;
const testRule = ruleTester(atRuleImportCase.rule, atRuleImportCase.ruleName);

const basics = (assert) => {
  assert.ok('');
  assert.ok('a { top: 0; }');
};

function ruleVariants(path) {
    return [
        `${path}`,
        `_${path}`,
        `${path}.scss`,
        `_${path}.css`,
    ].map((p) => `@import '${p}';`);
}

// PascalCase with mandatory leading underscore and optional extension
testRule(true, {pattern: '^_[A-Z][a-z]+(?:[A-Z][a-z]+)*(\.scss|\.css)?'}, (assert) => {
    basics(assert);

    assert.ok('@import "_PascalCase.scss";');
    assert.ok('@import \'_PascalCase.scss\';');
    assert.ok('@import "_PascalCase";');
    assert.ok('@import \'_PascalCase\';');

    assert.notOk('@import "_camelCase.scss"', messages.rejectedPattern);
    assert.notOk('@import "_camelCase"', messages.rejectedPattern);
    assert.notOk('@import \'_camelCase.scss\'', messages.rejectedPattern);
    assert.notOk('@import \'_camelCase\'', messages.rejectedPattern);
});

testRule(true, {case: 'PascalCase'}, (tr) => {
    ruleVariants('PascalCase').map(rule => tr.ok(rule));

    ruleVariants('camelCase').map(rule => tr.notOk(rule, messages.PascalCase));
    ruleVariants('kebab-case').map(rule => tr.notOk(rule, messages.PascalCase));
    ruleVariants('snake_case').map(rule => tr.notOk(rule, messages.PascalCase));
});

testRule(true, {case: 'camelCase'}, (tr) => {
    ruleVariants('camelCase').map(rule => tr.ok(rule));

    ruleVariants('PascalCase').map(rule => tr.notOk(rule, messages.camelCase));
    ruleVariants('kebab-case').map(rule => tr.notOk(rule, messages.camelCase));
    ruleVariants('snake_case').map(rule => tr.notOk(rule, messages.camelCase));
});

testRule(true, {case: 'kebab-case'}, (tr) => {
    ruleVariants('kebab-case').map(rule => tr.ok(rule));

    ruleVariants('PascalCase').map(rule => tr.notOk(rule, messages['kebab-case']));
    ruleVariants('camelCase').map(rule => tr.notOk(rule, messages['kebab-case']));
    ruleVariants('snake_case').map(rule => tr.notOk(rule, messages['kebab-case']));
});

testRule(true, {case: 'snake_case'}, (tr) => {
    ruleVariants('snake_case').map(rule => tr.ok(rule));

    ruleVariants('PascalCase').map(rule => tr.notOk(rule, messages.snake_case));
    ruleVariants('camelCase').map(rule => tr.notOk(rule, messages.snake_case));
    ruleVariants('kebab-case').map(rule => tr.notOk(rule, messages.snake_case));
});
