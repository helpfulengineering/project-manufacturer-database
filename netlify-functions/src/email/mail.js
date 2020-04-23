const composeMail = ({ fromName, toName, message }) => {
  const body = `
    Hello ${toName},
    
    Somebody is trying to contact you because you volunteered to help out with the Corona crisis.  
    
    Here's the message from "${fromName}":
    
    """
    ${message}
    """
    
    To you respond you can simply reply to this email. Doing so will make your email visible to that person.
    
    This email is send from the site: https://manucor.helpfulengineering.org/
  `;
  return {
    subject: `Volunteer contact request by ${fromName} - Manucor`,
    body,
  }
};

module.exports = {
  composeMail
};
