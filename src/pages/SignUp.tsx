
import MainLayout from "@/components/layout/MainLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import SocialSignUpButtons from "./SocialSignUpButtons";

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Create Your Account</h2>
            <p className="mt-2 text-muted-foreground">Join Pitch Perfect and start booking sports facilities</p>
          </div>
          <SignUpForm location={location} navigate={navigate} />
          <SocialSignUpButtons />
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignUp;
