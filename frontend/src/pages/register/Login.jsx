import React, { useEffect } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  // Get currentAuthUser from your user slice
  const { currentAuthUser, authUserLoading } = useSelector(
    (state) => state.user
  );

  // Handle redirection logic after Clerk auth state is loaded
  useEffect(() => {
    if (!isLoaded || authUserLoading) return;

    if (isSignedIn && currentAuthUser) {
      // If user has already selected a role → go to homepage
      if (currentAuthUser.profile) {
        navigate("/", { replace: true });
      }
      // If user is signed in but NO role yet → first-time user after signup
      else {
        navigate("/select-role", { replace: true });
      }
    }
  }, [isSignedIn, isLoaded, currentAuthUser, authUserLoading, navigate]);

  // If already signed in, the useEffect above will handle redirect
  if (isSignedIn) {
    return null; // or a tiny loader if you want
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <SignIn
        signUpUrl="/signup"
        afterSignInUrl="/login"
        afterSignUpUrl="/login"
      />
    </div>
  );
}

export default Login;