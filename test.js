const WordBreaker = require('./src');
const breaker = new WordBreaker('Hello\r\nworld!');
let b;

while (typeof (b = breaker.nextBreak()) === 'number') {
  console.log(b);
}
