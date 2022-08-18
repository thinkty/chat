
/**
 * JWT (or Id Token) is used for authenticating the user via the Firebase application.
 * The value is set by the OAuth provider.
 */
export const SESSION_KEY_ID_TOKEN = 'jwt';

/**
 * Display name of the user registered to the Firebase application.
 */
export const SESSION_KEY_NAME = 'name';

/**
 * Contains information related to the current session's user
 */
export type User = {
  /**
   * The ID token as a base64-encoded JSON Web Token (JWT) string.
   * `null` if it is not in session storage.
   */
  idToken: string,

  /**
   * The display name of the user or he user's unique ID, scoped to the project.
   * `null` if it is not in session storage.
   */
  name: string,
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
 * 
 * @returns {User | null} null if idToken/user does not exist or idToken has expired. Otherwise, User object.
 */
export function getUserFromSessionStorage(): User | null {

  const idToken = sessionStorage.getItem(SESSION_KEY_ID_TOKEN);
  const name = sessionStorage.getItem(SESSION_KEY_NAME);

  if (idToken == null || name == null) {
    return null;
  }

  const exp = getTokenExpirationTime(idToken);
  if (Date.now() >= exp * 1000) {
    removeUserSession(); // Clear session storage
    return null;
  }

  return {
    idToken,
    name,
  }
}

/**
 * Save user information to session storage
 * @param {User} user
 */
export function saveUserSession(user: User) {
  sessionStorage.setItem(SESSION_KEY_ID_TOKEN, user.idToken);
  sessionStorage.setItem(SESSION_KEY_NAME, user.name);
}

/**
 * Remove user information from the session storage
 */
export function removeUserSession() {
  sessionStorage.removeItem(SESSION_KEY_ID_TOKEN);
  sessionStorage.removeItem(SESSION_KEY_NAME);

  // TODO: in case of having multiple tabs open with the same account logged-in, when logging out, also log out from those tabs
  // see "What will happen if I am logged in on different tabs?" https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/

  // TODO: update description accordingly
}
