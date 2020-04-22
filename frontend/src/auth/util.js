import jwt_decode from "jwt-decode";
import get from 'lodash/get';

export const getUserId = (token) => {
  if (token) {
    const decoded = jwt_decode(token);
    return get(decoded, ['https://hasura.io/jwt/claims', 'x-hasura-user-id']);
  } else {
    return undefined;
  }
};
