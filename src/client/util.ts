/**
 * JWT (or Id Token) is used for authenticating the user via the Firebase application.
 * The value is set by the OAuth provider.
 */
export const SESSION_KEY_ID_TOKEN = 'jwt';

/**
 * Display name of the user registered to the Firebase application.
 */
export const SESSION_KEY_USER = 'user';

/**
 * Contains information related to the current session's user
 */
export type User = {
  /**
   * The ID token as a base64-encoded JSON Web Token (JWT) string.
   * `null` if it is not in session storage.
   */
  idToken: string | null,

  /**
   * The display name of the user or he user's unique ID, scoped to the project.
   * `null` if it is not in session storage.
   */
  user: string | null,
};

/**
 * Default user just for the initialization of the user state in App
 */
export const defaultUser: User = {
  idToken: null,
  user: null,
};

/**
 * Parse the expiration time from the base64 encoded JSON Web Token.
 * The expiration information is stored in the second block of the JWT.
 * 
 * @param {string} token
 * @returns {number} Expiration time of the JWT
 */
export function getTokenExpirationTime(token: string): number {
  return parseInt(JSON.parse(window.atob(token.split('.')[1])).exp);
}

/**
 * Checks the session storage for user information and checks the JWT (idToken) to see if it has expired.
 * @returns {User | null} null if idToken/user does not exist or idToken has expired. Otherwise, User object.
 */
export function getUserFromSessionStorage(): User | null {

  const idToken = sessionStorage.getItem(SESSION_KEY_ID_TOKEN);
  const user = sessionStorage.getItem(SESSION_KEY_USER);

  if (idToken == null || user == null) {
    return null;
  }

  const exp = getTokenExpirationTime(idToken);
  if (Date.now() >= exp * 1000) {
    logout(); // Clear session storage
    return null;
  }

  return {
    idToken,
    user,
  }
}

export function logout(): User {
  sessionStorage.removeItem(SESSION_KEY_ID_TOKEN);
  sessionStorage.removeItem(SESSION_KEY_USER);

  // TODO: in case of having multiple tabs open with the same account logged-in, when logging out, also log out from those tabs
  // see "What will happen if I am logged in on different tabs?" https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/

  return {
    idToken: null,
    user: null,
  };
}
