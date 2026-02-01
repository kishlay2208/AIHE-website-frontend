import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "@/components/lms/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import MyCourses from "@/pages/dashboard/MyCourses";
import Certificates from "@/pages/dashboard/Certificates";
import Donations from "@/pages/dashboard/Donations";
import Transactions from "@/pages/dashboard/Transactions";
import Settings from "@/pages/dashboard/Settings";
import StudentApprovals from "@/pages/dashboard/StudentApprovals";
import AttendanceManager from "@/pages/dashboard/AttendanceManager";
import Gradebook from "@/pages/dashboard/Gradebook";
import UserManagement from "@/pages/dashboard/UserManagement";
import CourseCreator from "@/pages/dashboard/CourseCreator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="donations" element={<Donations />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="settings" element={<Settings />} />
              <Route path="approvals" element={<StudentApprovals />} />
              <Route path="attendance" element={<AttendanceManager />} />
              <Route path="gradebook" element={<Gradebook />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="course-creator" element={<CourseCreator />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
