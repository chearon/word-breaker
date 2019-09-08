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

const classTrie = new UnicodeTrie(fs.readFileSync(__dirname + '/classes.trie'));

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
    this.nextClass = null;
    this.riCount = 0;
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
    return classTrie.get(this.nextCodePoint());
  }

  nextBreak() {
    while (this.pos < this.string.length) {
      let lastClass, curClass, nextClass;

      this.lastPos = this.pos;
      this.curClass = this.nextClass;
      if (!this.inSeq) {
        this.last4Class = this.cur4Class;
        this.cur4Class = this.nextClass;
      }
      this.nextClass = this.nextCharClass();

      this.inSeq = false;

      if (this.curClass == null) {
        return 0; // WB1
      }

      curClass = this.curClass;
      nextClass = this.nextClass;

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

      // WB4
      if (nextClass === Extend || nextClass === Format || nextClass === ZWJ) {
        this.inSeq = true;
        continue;
      }

      lastClass = this.last4Class;
      curClass = this.cur4Class;

      const mcurClass = mapClass(curClass);
      const mnextClass = mapClass(nextClass);

      // WB5
      if (mcurClass === AHLetter && mnextClass === AHLetter) continue;

      let peekNext;
      const restorePos = this.pos;
      do peekNext = this.nextCharClass();
      while (peekNext === Extend || peekNext === Format || peekNext === ZWJ);
      this.pos = restorePos;

      const mpeekNext = mapClass(peekNext);
      const mlastClass = mapClass(lastClass);

      if (curClass === Regional_Indicator) {
        this.riCount += 1;
      } else {
        this.riCount = 0;
      }

      // WB6
      if (mcurClass === AHLetter && (nextClass === MidLetter || mnextClass === MidNumLetQ) && mpeekNext === AHLetter) continue;
      
      // WB7
      if (mlastClass === AHLetter && (curClass === MidLetter || mcurClass === MidNumLetQ) && mnextClass === AHLetter) continue;

      // WB7a
      if (curClass === Hebrew_Letter && nextClass === Single_Quote) continue;

      // WB7b
      if (curClass === Hebrew_Letter && nextClass === Double_Quote && peekNext === Hebrew_Letter) continue;

      // WB7c
      if (lastClass === Hebrew_Letter && curClass === Double_Quote && nextClass === Hebrew_Letter) continue;

      // WB8
      if (curClass === Numeric && nextClass === Numeric) continue;

      // WB9
      if (mcurClass === AHLetter && nextClass === Numeric) continue;

      // WB10
      if (curClass === Numeric && mnextClass === AHLetter) continue;

      // WB11
      if (lastClass === Numeric && (curClass === MidNum || mcurClass === MidNumLetQ) && nextClass === Numeric) continue;

      // WB12
      if (curClass === Numeric && (nextClass === MidNum || mnextClass === MidNumLetQ) && peekNext === Numeric) continue;

      // WB13
      if (curClass === Katakana && nextClass === Katakana) continue;

      // WB13a
      if ((mcurClass === AHLetter || curClass ===  Numeric || curClass === Katakana || curClass === ExtendNumLet) && nextClass === ExtendNumLet) continue;

      // WB13b
      if (curClass === ExtendNumLet && (mnextClass === AHLetter || nextClass === Numeric || nextClass === Katakana)) continue;

      // WB15, WB16
      if (curClass === Regional_Indicator && nextClass === Regional_Indicator) {
        if (this.riCount % 2 === 1) continue;
      }

      // WB999
      return this.lastPos;
    }

    if (this.pos && !this.end) {
      this.end = true;
      return this.string.length; // WB2
    }

    return null;
  }
}

module.exports = WordBreaker;
