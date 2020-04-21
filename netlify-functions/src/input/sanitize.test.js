const {sanitizeInputs} = require("./sanitize");

describe('form validation', () => {
  const params = {
    from_name: 'John Doe',
    from_email: 'e+label@mail.com',
    to_entity_pk: 1,
    message: 'Hi there, this is me from hospital. I would like some help producing X, Y and Z. Can you help?'
  };

  const expected = {
    fromName: params.from_name,
    fromEmail: params.from_email,
    entityPk: params.to_entity_pk,
    message: params.message
  };

  it('should pass on all fields', () => {
    expect(sanitizeInputs(params)).toEqual(expected)
  });

  it('should sanitize the message', () => {
    expect(sanitizeInputs({
      ...params,
      message: '<script>console.log("evil");</script> HEY, click my link, please yes: https://www.youtube.com/watch?v=oHg5SJYRHA0 '
    })).toEqual({
      ...expected,
      message: ' HEY, click my link, please yes: https://www.youtube.com/watch?v=oHg5SJYRHA0 ',
    });
  });

  it('should sanitize the name', () => {
    expect(sanitizeInputs({
      ...params,
      from_name: '<script>alert("evil");</script> name'
    })).toEqual({
      ...expected,
      fromName: ' name',
    })
  })
});
