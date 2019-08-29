const UnicodeTrie = require('unicode-trie');
const fs = require('fs');
const {
  Double_Quote,
  Single_Quote,
  Hebrew_Letter,
  CR,
  LF,
  Newline,
  Extend,
  Regional_Indicator,
  Format,
  Katakana,
  ALetter,
  MidLetter,
  MidNum,
  MidNumLet,
  Numeric,
  ExtendNumLet,
  ZWJ,
  WSegSpace,
  Extended_Pictographic,
  AHLetter,
  MidNumLetQ
} = require('./classes');

const classTrie = new UnicodeTrie(fs.readFileSync(__dirname + '/classes.trie',));

// table 3a
function mapClass(c) {
  switch (c) {
    case ALetter:
    case Hebrew_Letter:
      return AHLetter;

    case MidNumLet:
    case Single_Quote:
      return MidNumLetQ;

    default:
      return c;
  }
}

class WordBreaker {
  constructor(string) {
    this.string = string;
    this.pos = 0;
    this.lastPos = 0;
    this.curClass = null;
    this.nextClass = null;
  }

  nextCodePoint() {
    const code = this.string.charCodeAt(this.pos++);
    const next = this.string.charCodeAt(this.pos);

    // If a surrogate pair
    if ((0xd800 <= code && code <= 0xdbff) && (0xdc00 <= next && next <= 0xdfff)) {
      this.pos++;
      return ((code - 0xd800) * 0x400) + (next - 0xdc00) + 0x10000;
    }

    return code;
  }

  nextCharClass() {
    return mapClass(classTrie.get(this.nextCodePoint()));
  }

  nextBreak() {
    while (this.pos < this.string.length) {
      this.lastPos = this.pos;
      this.curClass = this.nextClass;
      this.nextClass = this.nextCharClass();

      if (this.curClass == null) {
        return 0; // WB1
      }

      const {curClass, nextClass} = this;

      // WB3
      if (curClass === CR && nextClass === LF) continue;

      // WB3a
      if (curClass === Newline || curClass === CR || curClass == LF) return this.lastPos;

      // WB3b
      if (nextClass === Newline || nextClass === CR || nextClass == LF) return this.lastPos;

      // WB3c
      if (curClass === ZWJ && nextClass === Extended_Pictographic) continue;

      // WB3d
      if (curClass === WSegSpace && nextClass === WSegSpace) continue;

      // ---------
      // TODO 4 
      // ---------

      // WB5
      if (curClass === AHLetter && nextClass === AHLetter) continue;

      // ---------
      // TODO 6-16
      // ---------

      return this.lastPos; // WB999
    }

    if (this.pos && !this.end) {
      this.end = true;
      return this.string.length; // WB2
    }

    return null;
  }
}

module.exports = WordBreaker;
