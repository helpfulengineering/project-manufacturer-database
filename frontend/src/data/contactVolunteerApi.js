import { CONTACT_USER_API_URL } from '../config';

export default class ContactVolunteerApi {
  constructor(token) {
    this.token = token;
  }
  sendMessage({
    userName,
    userEmail,
    message,
    entityUserId,
  }) {
    const body = {
      from_name: userName,
      from_email: userEmail,
      to_entity_pk: entityUserId,
      message
    };
    return fetch(CONTACT_USER_API_URL,{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(response => {
      const status = response.status;
      if (status === 200) {
        return response.json();
      }
      return response.text().then(text => Promise.reject(text));
    });
  }
}
