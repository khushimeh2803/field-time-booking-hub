
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user || null;
        setUser(sessionUser);
        
        if (sessionUser && requireAdmin) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', sessionUser.id)
            .single();
            
          setProfile(profileData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [requireAdmin]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect to signin, but save the location they tried to access for later redirect
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    // Redirect to home page if user is not an admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
