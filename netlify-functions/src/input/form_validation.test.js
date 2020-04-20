const {validateEmail} = require("./form_validation");
const {FormError} = require("../errors");
const {validateFormParams} = require("./form_validation");

describe('form validation', () => {
  const params ={
    from_name: 'name',
    from_email: 'e@mail.com',
    to_entity_pk: 1
  };

  it('should check all fields', () => {
    expect(() => validateFormParams(params)).not.toThrow();
  });

  it('fails on bad email', () => {
    expect(() => validateFormParams({ ...params, from_email: 'some <at> mydomain.com'})).toThrowError(FormError);
    expect(() => validateFormParams({ ...params, from_email: ''})).toThrowError(FormError);
  });

  it('fails when fields are missing', () => {
    expect(() => validateFormParams({...params, from_name: ''})).toThrowError(FormError);
    expect(() => validateFormParams({...params, from_email: ''})).toThrowError(FormError);
    expect(() => validateFormParams({...params, to_entity_pk: ''})).toThrowError(FormError);
  });

  it('fails when on bad entity pk', () => {
    expect(() => validateFormParams({...params, to_entity_pk: '2.3'})).toThrowError(FormError);
    expect(() => validateFormParams({...params, to_entity_pk: 'abc'})).toThrowError(FormError);
  });

  it('email validation method', () => {
    expect(() => validateEmail('abc@xyz.com')).not.toThrowError(FormError);
    expect(() => validateEmail('some <at> mydomain.com')).toThrowError(FormError);
    expect(() => validateEmail('')).toThrowError(FormError);
  });
});
