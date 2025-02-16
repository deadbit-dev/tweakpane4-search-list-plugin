# Tweakpane plugin Search list


![version](https://badge.fury.io/js/tweakpane4-search-list-plugin.svg)

This is a plugin for [Tweakpane][tweakpane].

add searchable select list for tweakpane.

**required version `tweakpane@4.x`**

### Install

```bash
npm i tweakpane4-search-list-plugin
# or
yarn add tweakpane4-search-list-plugin
# or
bun i tweakpane4-search-list-plugin
```

### Usage

```js
import { Pane } from 'tweakpane';
import TweakpaneSearchListPlugin from 'tweakpane4-search-list-plugin';

const pane = new Pane();
pane.registerPlugin(TweakpaneSearchListPlugin);

const data = { language: 'JavaScript' };
pane.addBinding(data, 'language', {
  // use search-list
  view: 'search-list',
  options: {
    JavaScript: 'JavaScript',
    TypeScript: 'TypeScript',
    Java: 'Java',
    Go: 'Go',
    Dart: 'Dart',
    'C++': 'C++',
    'Object C': 'Object C',
    'C#': 'C#',
    Python: 'Python'
  }
});
// ...
```

### Options

```js
pane.addBinding(data, 'field', {
  view: 'search-list',
  options: {
    // ...
  },
  noDataText: 'no data',
  debounceDelay: 250,
});
```

| param         | description                                                 | type   | default   |
|---------------|-------------------------------------------------------------|--------|-----------|
| noDataText    | text to show if no options matched                          | string | 'no data' |
| debounceDelay | delay time to apply on lodash.debounce, for debounce search | number | 250       |

### CSS variables

```css
:root {
  --tp-plugin-select-box-bg-color: --input-background-color;
  --tp-plugin-select-no-data-color: #fff;
  --tp-plugin-select-option-bg-hover: rgb(129, 129, 129);
}
```

[tweakpane]: https://github.com/cocopon/tweakpane/
