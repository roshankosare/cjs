import { useAuth } from "@/auth/useAuth";
import SignIn from "@/components/auth/sign-in";
import { Navigate } from "react-router-dom";

const SignInPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-screen flex justify-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;
