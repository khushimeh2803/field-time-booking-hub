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
import Payment from "./pages/Payment";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/grounds" element={<Grounds />} />
          <Route path="/grounds/:id" element={<GroundDetails />} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="*" element={<NotFound />} />
          
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="sports" element={<AdminSports />} />
            <Route path="grounds" element={<AdminGrounds />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="promo-codes" element={<PromoManagement />} />
            <Route path="membership-plans" element={<MembershipPlans />} />
            <Route path="user-memberships" element={<UserMemberships />} />
            <Route path="contact-submissions" element={<ContactSubmissions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
