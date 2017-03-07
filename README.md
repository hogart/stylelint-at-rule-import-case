# stylelint-at-rule-import-path

A custom [stylelint](https://github.com/stylelint/stylelint) rule to enforce consistent filename case in `@import` statements. Heavily based on excellent [Tim Johnson's](https://github.com/timothyneiljohnson) [stylelint-at-rule-import-path](https://github.com/timothyneiljohnson/stylelint-at-rule-import-path).

This rule will cause stylelint to warn you whenever file names in `@import` don't follow given case or custom pattern. It doesn't check if files are named correctly though, so if your filesystem is case-insensitive and VCS is not, you should check twice what are you commiting.

## Installation

```
npm install stylelint-at-rule-import-case
```

This plugin is compatible with v5.0.1+.

## Details

There are 2 options: `case` (`'camelCase'`, `'kebab-case'`, `'PascalCase'`, `'snake_case'`) and `pattern` (regexp or string). Options are mutually exclusive (i.e. `pattern` will be skipped if `case` option is included). `case` will only check filename without leading underscore and extension, while `pattern` should be matched against raw file name.

With `case: 'camelCase'` :
```css
@import('_camelCase'); /* OK */
@import('_camel'); /* OK */
@import('_camelCase.scss'); /* OK */
@import('_camelCase.css'); /* OK */

@import('_kebab-case'); /* Not OK */
@import('PascalCase'); /* Not OK */
@import('_snake_case'); /* Not OK */
```

With `pattern: "^_[A-Z][a-z]+(?:[A-Z][a-z]+)*(\.scss|\.css)?"` (PascalCase with mandatory leading `_` and optional extension):
```css
@import('_PascalCase.css'); /* OK */
@import('_Pascal'); /* OK */

@import('PascalCase.scss'); /* Not OK */
@import('_kebab-case'); /* Not OK */
@import('_snake_case'); /* Not OK */
```


## Usage

Add `"stylelint-at-rule-import-case"` to your stylelint config `plugins` array, then add `at-rule-import-case` to your rules, set to your preferred options.

As follows:

```js
{
  "plugins": [
    "stylelint-at-rule-import-case"
  ],
  "rules": {
    "at-rule-import-case": [true, {
      case: "kebab-case"
    }]
  }
};
```
