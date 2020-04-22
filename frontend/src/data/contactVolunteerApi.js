import { CONTACT_USER_API_URL } from '../config';

export default class ContactVolunteerApi {
  constructor(token) {
    this.token = token;
  }
  sendMessage({
    userName,
    userEmail,
    message,
    contactUserId,
  }) {
    const body = {
      from_name: userName,
      from_email: userEmail,
      message,
      to_entity_pk: contactUserId,
      do_not_fill: null, // I don't think this will be very effective even with hidden input, perhaps silent recaptcha instead?
    };
    return fetch(CONTACT_USER_API_URL,{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}