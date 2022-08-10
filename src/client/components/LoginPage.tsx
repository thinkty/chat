import { User } from 'firebase/auth';
import React from 'react';
import { Page } from '../App';

type FirebaseAuthResponse = {
  user: User,
  idToken: string,
};

export const LoginPage = ({
  setPage,
} : {
  setPage: React.Dispatch<React.SetStateAction<Page>>
}): JSX.Element => {

  // Send the Id Token to the server to authenticate with Firebase
  async function handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
    const idToken = response.credential;

    const result = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (result.ok) {
      const data: FirebaseAuthResponse = await result.json();
      console.log('Succesful authentication');
      console.log(data.user);
      console.log(data.idToken);

      // TODO: Save user data to local storage and redirect to main page where it will read from local storage and check with the server to make sure it is a valid token
    }

    // TODO: Error handling
  }

  // Load sign-in-with-google script
  const status = useScript('https://accounts.google.com/gsi/client');

  if (status === "ready") {
    google.accounts.id.initialize({
      client_id: "950484081367-5u480vk65qg38kogmka1ptaqpacrhpnj.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv")!,
      {theme: 'outline', size: 'large', type: 'standard'}  // customization attributes
    );
  }

  return (
    <>
      <h1>
        Chat
      </h1>
      LoginPage
      <div id="buttonDiv"></div> 
    </>
  );
}

type ScriptStatus = "idle" | "loading" | "ready" | "error";

// Function to load/use scripts in React
// @see https://usehooks.com/useScript/
function useScript(src: string) {
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
    // Fetch existing script element by src
    // It may have been added by another intance of this hook
    let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);

    // Create script
    if (script == null) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");

      // Add script to document body
      document.body.appendChild(script);

      // Store status in attribute on script
      // This can be read by other instances of this hook
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
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === "load" ? "ready" : "error");
      };

      // Add event listeners
      script.addEventListener("load", setStateFromEvent);
      script.addEventListener("error", setStateFromEvent);

      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener("load", setStateFromEvent);
          script.removeEventListener("error", setStateFromEvent);
        }
      };
    },
    [src] // Only re-run effect if script src changes
  );

  return status;
}
