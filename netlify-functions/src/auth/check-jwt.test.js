const {AuthError} = require("../errors");
const {extractToken} = require("./check-jwt");

describe('extractToken', () => {
  test('it gets the token', () => {
    expect(extractToken('Bearer 123abc')).toBe('123abc');
  });

  test('it expects header', () => {
    expect(() => extractToken(''))
      .toThrowError(new AuthError('Authorization header missing'))
  });

  test('it expects bearer', () => {
    expect(() => extractToken('some other auth header type'))
      .toThrowError(new AuthError('Authorization bearer missing'))
  });

});
