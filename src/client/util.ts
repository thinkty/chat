import React from 'react';

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
 * Provider of the JWT
 */
export const SESSION_PROVIDER = 'provider';
export type Provider = 'google';

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

  /**
   * The provider of the JWT
   */
  provider: Provider,
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
  const provider = sessionStorage.getItem(SESSION_PROVIDER);

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
    provider: provider as Provider,
  };
}

/**
 * Save user information to session storage
 * @param {User} user
 */
export function saveUserSession(user: User) {
  sessionStorage.setItem(SESSION_KEY_ID_TOKEN, user.idToken);
  sessionStorage.setItem(SESSION_KEY_NAME, user.name);
  sessionStorage.setItem(SESSION_PROVIDER, user.provider);
}

/**
 * Remove user information from the session storage
 */
export function removeUserSession() {
  const user = getUserFromSessionStorage();

  if (!user) {
    return;
  }

  if (user.provider == 'google') {
    // I don't really understand what this is doing
    google.accounts.id.disableAutoSelect();
  }

  sessionStorage.removeItem(SESSION_KEY_ID_TOKEN);
  sessionStorage.removeItem(SESSION_KEY_NAME);
  sessionStorage.removeItem(SESSION_PROVIDER);

  // TODO: in case of having multiple tabs open with the same account logged-in, when logging out, also log out from those tabs
  // see "What will happen if I am logged in on different tabs?" https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/

  // TODO: update description accordingly
}

export type ScriptStatus = "idle" | "loading" | "ready" | "error";

/**
 * Function to asynchronously load/ scripts in React.
 * 
 * @param {string} src Url of the script to load
 * @returns {ScriptStatus} 
 * @see https://usehooks.com/useScript/
 */
 export function useScript(src: string): ScriptStatus {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = React.useState<ScriptStatus>("loading");

  // Helper function to set string to ScriptStatus
  function stos(value: string): ScriptStatus {
    switch (value) {
      case "idle":
        return "idle";
      case "ready":
        return "ready";
      case "error":
        return "error";
      default:
        return "loading";
    }
  }

  React.useEffect(() => {
    // Fetch existing script element by src. It may have been added by another intance of this hook
    let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);

    // Create script
    if (script == null) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");

      // Add script to document body
      document.body.appendChild(script);

      // Store status in attribute on script. This can be read by other instances of this hook
      const setAttributeFromEvent = (event: Event) => {
        script!.setAttribute("data-status", event.type === "load" ? "ready" : "error");
      };

      script.addEventListener("load", setAttributeFromEvent);
      script.addEventListener("error", setAttributeFromEvent);
    } else {

      // Grab existing script status from attribute and set to state.
      setStatus(stos(script.getAttribute("data-status")!));
    }

    // Script event handler to update status in state
    // Note: Even if the script already exists we still need to add event handlers to update the state for *this* hook instance.
    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === "load" ? "ready" : "error");
    };

    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);

    // Remove event listeners on cleanup
    return () => {
      if (script) {
        script.removeEventListener("load", setStateFromEvent);
        script.removeEventListener("error", setStateFromEvent);
      }
    }},
    [src] // Only re-run effect if script src changes
  );

  return status;
}
