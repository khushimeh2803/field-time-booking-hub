
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Sports from "./pages/Sports";
import Grounds from "./pages/Grounds";
import GroundDetails from "./pages/GroundDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Membership from "./pages/Membership";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSports from "./pages/admin/Sports";
import AdminGrounds from "./pages/admin/Grounds";
import AdminUsers from "./pages/admin/Users";
import AdminBookings from "./pages/admin/Bookings";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminFeedback from "./pages/admin/Feedback";
import PromoManagement from "./pages/admin/PromoManagement";
import MembershipPlans from "./pages/admin/MembershipPlans";
import UserMemberships from "./pages/admin/UserMemberships";
import ContactSubmissions from "./pages/admin/ContactSubmissions";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/grounds" element={<Grounds />} />
            <Route path="/grounds/:id" element={<GroundDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/grounds" element={<ProtectedRoute><AdminGrounds /></ProtectedRoute>} />
            <Route path="/admin/sports" element={<ProtectedRoute><AdminSports /></ProtectedRoute>} />
            <Route path="/admin/membership-plans" element={<ProtectedRoute><MembershipPlans /></ProtectedRoute>} />
            <Route path="/admin/user-memberships" element={<ProtectedRoute><UserMemberships /></ProtectedRoute>} />
            <Route path="/admin/promo-management" element={<ProtectedRoute><PromoManagement /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute><AdminFeedback /></ProtectedRoute>} />
            <Route path="/admin/contact-submissions" element={<ProtectedRoute><ContactSubmissions /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
