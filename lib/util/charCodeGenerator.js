/**
 * A character code generator.
 * 32 — 126 (inclusive),
 * 161 — 191 (inclusive),
 * 8364 (€)
 * @see https://jsdev.space/js-generators-guide/
 */
export function * charCodeGenerator () {
  for (let i = 32; i < 127; i++) {
    yield i;
  }
  for (let k = 161; k <= 191; k++) {
    yield k;
  }
  yield 8364;
}

export default charCodeGenerator;
