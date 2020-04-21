const { isEmail } = require('./check');

describe('parser/check', () => {
  it('checks email value', () => {
    expect(isEmail('foo@bar.com')).toBe(true);
    expect(isEmail('foo1231$$+foo@bar.com')).toBe(true);
    expect(isEmail('foo@bar')).toBe(false);
    expect(isEmail('foo <at> bar')).toBe(false);
    expect(isEmail('mail me at abc@xyz.com')).toBe(false);
    expect(isEmail('foo@bar.com, abc@xyz.com')).toBe(false);
  });
});
