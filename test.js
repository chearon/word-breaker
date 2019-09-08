const WordBreaker = require('./src');

// extracted from tooltips on row headers
const rowmap = [
  null,
  '\u0001',
  '\u000D',
  '\u000A',
  '\u000B',
  '\u3031',
  '\u0041',
  '\u003A',
  '\u002C',
  '\u002E',
  '\u0030',
  '\u005F',
  String.fromCodePoint(0x1F1E6),
  '\u05D0',
  '\u0022',
  '\u0027',
  '\u231A',
  '\u0020',
  '\u00AD',
  '\u0300',
  '\u200D',
  '\u0061\u2060',
  '\u0061\u003A',
  '\u0061\u0027',
  '\u0061\u0027\u2060',
  '\u0061\u002C',
  '\u0031\u003A',
  '\u0031\u0027',
  '\u0031\u002C',
  '\u0031\u002E\u2060'
];

// extracted from tooltips on col headers
const colmap = [
  null,
  '\u0001',
  '\u000D',
  '\u000A',
  '\u000B',
  '\u3031',
  '\u0041',
  '\u003A',
  '\u002C',
  '\u002E',
  '\u0030',
  '\u005F',
  String.fromCodePoint(0x1F1E6),
  '\u05D0',
  '\u0022',
  '\u0027',
  '\u231A',
  '\u0020',
  '\u00AD',
  '\u0300',
  '\u200D'
];

// copy/paste from
// https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/WordBreakTest.html#table
const table = `	Other	CR	LF	Newline	Katakana	ALetter	MidLetter	MidNum	MidNumLet	Numeric	ExtendNumLet	RI	Hebrew_Letter	Double_Quote	Single_Quote	ExtPict	WSegSpace	Format_FE	Extend_FE	ZWJ_FE
Other	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
CR	÷	÷	×	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷
LF	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷
Newline	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷
Katakana	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	÷	×	×	×
ALetter	÷	÷	÷	÷	÷	×	÷	÷	÷	×	×	÷	×	÷	÷	÷	÷	×	×	×
MidLetter	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
MidNum	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
MidNumLet	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
Numeric	÷	÷	÷	÷	÷	×	÷	÷	÷	×	×	÷	×	÷	÷	÷	÷	×	×	×
ExtendNumLet	÷	÷	÷	÷	×	×	÷	÷	÷	×	×	÷	×	÷	÷	÷	÷	×	×	×
RI	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	×	×	×
Hebrew_Letter	÷	÷	÷	÷	÷	×	÷	÷	÷	×	×	÷	×	÷	×	÷	÷	×	×	×
Double_Quote	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
Single_Quote	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
ExtPict	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
WSegSpace	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×	×
Format_FE	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
Extend_FE	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
ZWJ_FE	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	÷	×	×	×
ALetter Format_FE	÷	÷	÷	÷	÷	×	÷	÷	÷	×	×	÷	×	÷	÷	÷	÷	×	×	×
ALetter MidLetter	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	×	×	×
ALetter Single_Quote	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	×	×	×
ALetter Single_Quote Format_FE	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	×	×	×
ALetter MidNum	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
Numeric MidLetter	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	×	×
Numeric Single_Quote	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	÷	÷	×	×	×
Numeric MidNum	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	÷	÷	×	×	×
Numeric MidNumLet Format_FE	÷	÷	÷	÷	÷	÷	÷	÷	÷	×	÷	÷	÷	÷	÷	÷	÷	×	×	×`;

const all = table.split('\n').map(row => row.split('\t'));
const headers = all[0];

let nPass = 0;
let nFail = 0;

for (let i = 1; i < all.length; ++i) {
  const row = all[i];
  const rowName = row[0];
  for (let j = 1; j < row.length; ++j) {
    const colName = headers[j];
    const brk = new WordBreaker(rowmap[i] + colmap[j]);
    let didBreak = false;
    let b;

    while (typeof (b = brk.nextBreak()) === 'number') {
      if (b === rowmap[i].length) {
        didBreak = true;
        break;
      }
    }

    const shouldBreak = all[i][j] === '÷';

    if (didBreak && !shouldBreak) {
      console.error("Failure expected no break for", rowName, colName);
      nFail += 1;
    } else if (!didBreak && shouldBreak) {
      console.error("Failure expected break for", rowName, colName);
      nFail += 1;
    } else {
      nPass += 1;
    }
  }
}

const RIA = String.fromCodePoint(0x1F1E6);
const RIB = String.fromCodePoint(0x1F1E7);
const RIC = String.fromCodePoint(0x1F1E8);
const RID = String.fromCodePoint(0x1F1E9);

const BBY = String.fromCodePoint(0x1F476);
const BRN = String.fromCodePoint(0x1F3FF);
const STP = String.fromCodePoint(0x1F6D1);

const samples = [
  /* 01 */ {text: '\u000D\u000A\u0061\u000A\u0308', bounds: [0, 2, 3, 4, 5]},
  /* 02 */ {text: '\u0061\u0308', bounds: [0, 2]},
  /* 03 */ {text: '\u0020\u200D\u0646', bounds: [0, 2, 3]},
  /* 04 */ {text: '\u0646\u200D\u0020', bounds: [0, 2, 3]},
  /* 05 */ {text: '\u0041\u0041\u0041', bounds: [0, 3]},
  /* 06 */ {text: '\u0041\u003A\u0041', bounds: [0, 3]},
  /* 07 */ {text: '\u0041\u003A\u003A\u0041', bounds: [0, 1, 2, 3, 4]},
  /* 08 */ {text: '\u05D0\u0027', bounds: [0, 2]},
  /* 09 */ {text: '\u05D0\u0022\u05D0', bounds: [0, 3]},
  /* 10 */ {text: '\u0041\u0030\u0030\u0041', bounds: [0, 4]},
  /* 11 */ {text: '\u0030\u002C\u0030', bounds: [0, 3]},
  /* 12 */ {text: '\u0030\u002C\u002C\u0030', bounds: [0, 1, 2, 3, 4]},
  /* 13 */ {text: '\u3031\u3031', bounds: [0, 2]},
  /* 14 */ {text: '\u0041\u005F\u0030\u005F\u3031\u005F', bounds: [0, 6]},
  /* 15 */ {text: '\u0041\u005F\u005F\u0041', bounds: [0, 4]},
  /* 16 */ {text: RIA + RIB + RIC + '\u0062', bounds: [0, 4, 6, 7]},
  /* 17 */ {text: '\u0061' + RIA + RIB + RIC + '\u0062', bounds: [0, 1, 5, 7, 8]},
  /* 18 */ {text: '\u0061' + RIA + RIB + '\u200D' + RIC + '\u0062', bounds: [0, 1, 6, 8, 9]},
  /* 19 */ {text: '\u0061' + RIA + '\u200D' + RIB + RIC + '\u0062', bounds: [0, 1, 6, 8, 9]},
  /* 20 */ {text: '\u0061' + RIA + RIB + RIC + RID + '\u0062', bounds: [0, 1, 5, 9, 10]},
  /* 21 */ {text: BBY + BRN + BBY, bounds: [0, 4, 6]},
  /* 22 */ {text: STP + '\u200D' + STP, bounds: [0, 5]},
  /* 23 */ {text: '\u0061\u200D' + STP, bounds: [0, 4]},
  /* 24 */ {text: '\u2701\u200D\u2701', bounds: [0, 3]},
  /* 25 */ {text: '\u0061\u200D\u2701', bounds: [0, 3]},
  /* 26 */ {text: BBY + BRN + '\u0308\u200D' + BBY + BRN, bounds: [0, 10]},
  /* 27 */ {text: STP + BRN, bounds: [0, 4]},
  /* 28 */ {text: '\u200D' + STP + BRN, bounds: [0, 5]},
  /* 29 */ {text: '\u200D' + STP, bounds: [0, 3]},
  /* 30 */ {text: '\u200D' + STP, bounds: [0, 3]},
  /* 31 */ {text: STP + STP, bounds: [0, 2, 4]},
  /* 32 */ {text: '\u0061\u0308\u200D\u0308\u0062', bounds: [0, 5]},
  /* 33 */ {text: '\u0061\u0020\u0020\u0062', bounds: [0, 1, 3, 4]}
];

let n = 0;
for (const {text: s, bounds: expected} of samples) {
  const brk = new WordBreaker(s);
  let i = 0;
  let b;
  let didPass = true;

  n += 1;

  while (typeof (b = brk.nextBreak()) === 'number') {
    if (expected[i++] !== b) {
      console.error(`For sample ${n}, break #${i - 1} was ${b}, expected ${expected[i-1]}`);
      didPass = false;
      break;
    }
  }

  if (didPass) {
    nPass += 1;
  } else {
    nFail += 1;
  }
}

console.log(`${nPass} passsed ${nFail} failed`);
process.exit(nFail);
