import { useEffect, useRef, useState } from 'react';
import './GoogleSignIn.css';

function GoogleSignIn({ onSuccess, onError, text = 'Sign in with Google' }) {
  const buttonRef = useRef(null);
  const isInitialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
      setError('Google Client ID not configured');
      setIsLoading(false);
      if (onError) {
        onError('Google Sign In is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.');
      }
      return;
    }

    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogleSignIn(clientId);
      return;
    }

    // Wait for Google script to load
    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogle);
        initializeGoogleSignIn(clientId);
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkGoogle);
      setIsLoading(false);
      setError('Google Sign In failed to load. Please refresh the page.');
      if (onError) {
        onError('Google Sign In failed to load. Please refresh the page.');
      }
    }, 10000);

    return () => {
      clearInterval(checkGoogle);
      clearTimeout(timeout);
    };
  }, [onError]);

  const initializeGoogleSignIn = (clientId) => {
    if (!window.google?.accounts?.id || !buttonRef.current || isInitialized.current) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Wait a bit for the container to be ready
      setTimeout(() => {
        if (buttonRef.current && !isInitialized.current) {
          window.google.accounts.id.renderButton(
            buttonRef.current,
            {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              width: 300,
            }
          );
          isInitialized.current = true;
          setIsLoading(false);
        }
      }, 100);
    } catch (error) {
      console.error('Error initializing Google Sign In:', error);
      setIsLoading(false);
      setError('Failed to initialize Google Sign In');
      if (onError) {
        onError('Failed to initialize Google Sign In. Please try again.');
      }
    }
  };

  const handleCredentialResponse = (response) => {
    try {
      // Decode the JWT token to get user info
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const userData = JSON.parse(jsonPayload);
      
      // Call success handler with user data
      if (onSuccess) {
        onSuccess({
          id: userData.sub,
          email: userData.email,
          name: userData.name || userData.given_name || userData.email.split('@')[0],
          picture: userData.picture,
          emailVerified: userData.email_verified,
          provider: 'google',
        });
      }
    } catch (error) {
      console.error('Error processing Google credential:', error);
      if (onError) {
        onError('Failed to process Google sign in. Please try again.');
      }
    }
  };

  // Show loading or error state
  if (error) {
    return (
      <div className="google-signin-error">
        <p>{error}</p>
        <button
          type="button"
          className="google-signin-button fallback"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="google-signin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Google Sign In...</p>
      </div>
    );
  }

  return <div ref={buttonRef} className="google-signin-container"></div>;
}

export default GoogleSignIn;
