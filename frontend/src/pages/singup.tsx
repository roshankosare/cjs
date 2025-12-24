import { useAuth } from "@/auth/useAuth";
import SignUp from "@/components/auth/sign-up";
import { Navigate } from "react-router-dom";
const SignUpPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="w-full h-screen flex justify-center ">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
