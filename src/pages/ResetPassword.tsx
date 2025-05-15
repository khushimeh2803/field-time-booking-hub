
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a valid password reset URL
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      setIsInvalidLink(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password
      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Invalid Password",
          description: "Password must be at least 6 characters long."
        });
        setIsLoading(false);
        return;
      }

      // Confirm passwords match
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords Don't Match",
          description: "Please ensure both passwords match."
        });
        setIsLoading(false);
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully."
      });

      // Redirect to sign in page
      setTimeout(() => navigate("/signin"), 1500);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reset password. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInvalidLink) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-bold text-foreground">Invalid Reset Link</h2>
            <p className="text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
            <Button onClick={() => navigate("/forgot-password")} className="mt-4">
              Request New Reset Link
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Create New Password</h2>
            <p className="mt-2 text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
