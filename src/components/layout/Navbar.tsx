
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        fetchUserProfile(data.session.user.id);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-primary font-bold text-2xl">Pitch Perfect</span>
          <span className="text-accent font-medium">Booking</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/sports" className="text-foreground hover:text-primary transition-colors">
            Sports
          </Link>
          <Link to="/grounds" className="text-foreground hover:text-primary transition-colors">
            Grounds
          </Link>
          <Link to="/membership" className="text-foreground hover:text-primary transition-colors">
            Membership
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user.email} />
                    <AvatarFallback>
                      {profile?.full_name 
                        ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() 
                        : user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
                  My Bookings
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User size={16} />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg absolute top-16 left-0 right-0 z-50">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/sports" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sports
            </Link>
            <Link 
              to="/grounds" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Grounds
            </Link>
            <Link 
              to="/membership" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Membership
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            
            <div className="flex flex-col space-y-2 pt-2 border-t">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user.email} />
                      <AvatarFallback>
                        {profile?.full_name 
                          ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() 
                          : user.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/my-bookings" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start text-left">My Bookings</Button>
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start text-left">Admin Dashboard</Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left text-red-600"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center bg-primary hover:bg-primary/90">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
