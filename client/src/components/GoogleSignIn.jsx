import { useEffect, useRef, useState } from 'react';
import './GoogleSignIn.css';

function GoogleSignIn({ onSuccess, onError, text = 'Sign in with Google' }) {
  const buttonRef = useRef(null);
  const isInitialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    console.log('Google Sign-In: Checking configuration...', {
      hasClientId: !!clientId,
      clientIdPrefix: clientId ? clientId.substring(0, 20) + '...' : 'none',
      hasGoogleScript: !!window.google,
      hasAccountsId: !!window.google?.accounts?.id
    });
    
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID' || clientId.includes('YOUR_CLIENT_ID')) {
      console.error('Google Sign-In: Client ID not configured');
      setError('Google Client ID not configured');
      setIsLoading(false);
      if (onError) {
        onError('Google Sign In is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.');
      }
      return;
    }

    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      console.log('Google Sign-In: Script already loaded, initializing...');
      initializeGoogleSignIn(clientId);
      return;
    }

    console.log('Google Sign-In: Waiting for Google script to load...');
    let checkCount = 0;
    const maxChecks = 100; // 10 seconds total (100 * 100ms)

    // Wait for Google script to load
    const checkGoogle = setInterval(() => {
      checkCount++;
      if (window.google?.accounts?.id) {
        console.log('Google Sign-In: Script loaded, initializing...');
        clearInterval(checkGoogle);
        initializeGoogleSignIn(clientId);
      } else if (checkCount >= maxChecks) {
        console.error('Google Sign-In: Timeout waiting for Google script');
        clearInterval(checkGoogle);
        setIsLoading(false);
        setError('Google Sign In failed to load. The Google script may be blocked or not loading. Please check your browser console and network tab.');
        if (onError) {
          onError('Google Sign In failed to load. Please refresh the page or check your browser settings.');
        }
      }
    }, 100);

    return () => {
      clearInterval(checkGoogle);
    };
  }, [onError]);

  const initializeGoogleSignIn = (clientId) => {
    console.log('Google Sign-In: Initializing...', {
      hasGoogle: !!window.google?.accounts?.id,
      hasButtonRef: !!buttonRef.current,
      isInitialized: isInitialized.current
    });

    if (!window.google?.accounts?.id) {
      console.error('Google Sign-In: window.google.accounts.id not available');
      setIsLoading(false);
      setError('Google Sign In script not loaded. Please refresh the page.');
      if (onError) {
        onError('Google Sign In script not loaded. Please refresh the page.');
      }
      return;
    }

    if (!buttonRef.current) {
      console.warn('Google Sign-In: Button ref not ready, waiting...');
      // Wait a bit for the ref to be ready
      setTimeout(() => initializeGoogleSignIn(clientId), 200);
      return;
    }

    if (isInitialized.current) {
      console.log('Google Sign-In: Already initialized');
      return;
    }

    try {
      console.log('Google Sign-In: Calling initialize...');
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      console.log('Google Sign-In: Rendering button...');
      // Wait a bit for the container to be ready
      setTimeout(() => {
        if (buttonRef.current && !isInitialized.current) {
          try {
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
            console.log('Google Sign-In: Button rendered successfully');
          } catch (renderError) {
            console.error('Google Sign-In: Error rendering button:', renderError);
            setIsLoading(false);
            setError('Failed to render Google Sign In button. Please try again.');
            if (onError) {
              onError('Failed to render Google Sign In button. Please try again.');
            }
          }
        }
      }, 100);
    } catch (error) {
      console.error('Google Sign-In: Error initializing:', error);
      setIsLoading(false);
      setError(`Failed to initialize Google Sign In: ${error.message}`);
      if (onError) {
        onError(`Failed to initialize Google Sign In: ${error.message}`);
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
