
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: "Please enter a valid email address."
        });
        setIsLoading(false);
        return;
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Email Sent",
        description: "Check your inbox for the password reset link."
      });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Reset Your Password</h2>
            <p className="mt-2 text-muted-foreground">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Check your email</h3>
              <p className="text-muted-foreground">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSuccess(false)}
                >
                  Return to reset password
                </Button>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>
              </div>

              <div className="text-center">
                <Link to="/signin" className="text-primary hover:text-primary/80 text-sm">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
