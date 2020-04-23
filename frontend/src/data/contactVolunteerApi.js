import { CONTACT_USER_API_URL } from '../config';
import {trackEvent} from "../analytics";
import {getUserId} from "../auth/util";

export default class ContactVolunteerApi {
  constructor(token) {
    this.token = token;
    this.userId = getUserId(token);
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
    trackEvent('mail-send-start', { fromUserId: this.userId, toEntityPk: entityUserId });
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

        trackEvent('mail-send-success', { fromUserId: this.userId, toEntityPk: entityUserId });
        return response.json();
      }
      trackEvent('mail-send-error', { fromUserId: this.userId, toEntityPk: entityUserId, status });
      return response.text().then(text => Promise.reject(text));
    });
  }
}
