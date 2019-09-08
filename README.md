# word-breaker

Implementation of the Unicode Word Boundary Rules algorithm (UAX29 4.1). At time of writing it targets **Unicode 12**.

What are word boundaries used for?
* When you double click a word inside your web browser, UAX29 sec 4 defines where the start and end of the selection should be
* CSS's text-transform: uppercase
* Can be used for search algorithms too

It will keep together grapheme clusters, like emojis with skin tones or diacritical marks like an accent grave. It passes all 613 tests from the [Unicode auxillary files](https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/WordBreakTest.html#samples) for word breaks.

## API

```javascript
const WordBreaker = require('word-breaker');
const string = 'UAX29 has rules like   WB4\t👌🏼';
const wb = new WordBreaker(string);
let last = null;
let i;

while ((i = wb.nextBreak()) !== null) {
  if (last !== null) console.log(string.slice(last, i));
  last = i;
}

// output:
// UAX29
// _
// has
// _
// rules
// _
// like
// ___
// WB4
// \t
// 👌🏼
```

## More info

Inspired by [foliojs/grapheme-breaker](https://github.com/foliojs/grapheme-breaker) which comes from the same specification,  and [foliojs/linebreak](https://github.com/foliojs/linebreak). It uses the same project structure as well as [unicode-trie](https://github.com/foliojs/unicode-trie) for character classification.
