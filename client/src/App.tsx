import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Programs } from './pages/Programs';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { AITutor } from './pages/AITutor';
import { Internships } from './pages/Internships';
import { Careers } from './pages/Careers';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Pricing } from './pages/Pricing';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { NotFound } from './pages/NotFound';

// LEARNOVA Student Experience
import { Dashboard } from './pages/Dashboard';
import { StudentProfile } from './pages/StudentProfile';
import { CareerAssessment } from './pages/CareerAssessment';
import { InterviewList } from './pages/InterviewList';
import { InterviewNew } from './pages/InterviewNew';
import { InterviewSession } from './pages/InterviewSession';
import { InterviewReport } from './pages/InterviewReport';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { PersonalizedRoadmap } from './pages/PersonalizedRoadmap';
import { CodingSandbox } from './pages/CodingSandbox';
import { ProjectMentor } from './pages/ProjectMentor';
import { CareerAnalytics } from './pages/CareerAnalytics';

// Preserved Existing Student Course Pages
import { MyCourses } from './pages/MyCourses';
import { LearningPath } from './pages/LearningPath';

// Admin Portal Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCourses } from './pages/AdminCourses';
import { AdminInternships } from './pages/AdminInternships';
import { AdminUsers } from './pages/AdminUsers';
import { AdminSettings } from './pages/AdminSettings';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Layout Wrapper
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#080B18] text-[#F5F7FF] font-sans selection:bg-[#8065FF] selection:text-white">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppLayout>
          <Routes>
            {/* 1. Public Core Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />

            {/* 2. Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* 3. LEARNOVA Student Career Intelligence Suite */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/assessments"
              element={
                <ProtectedRoute>
                  <CareerAssessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/interviews"
              element={
                <ProtectedRoute>
                  <InterviewList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/interviews/new"
              element={
                <ProtectedRoute>
                  <InterviewNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/interviews/:id"
              element={
                <ProtectedRoute>
                  <InterviewSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/interviews/:id/report"
              element={
                <ProtectedRoute>
                  <InterviewReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/resume"
              element={
                <ProtectedRoute>
                  <ResumeAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/career"
              element={
                <ProtectedRoute>
                  <CareerAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/learning/roadmap"
              element={
                <ProtectedRoute>
                  <PersonalizedRoadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/coding"
              element={
                <ProtectedRoute>
                  <CodingSandbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/projects"
              element={
                <ProtectedRoute>
                  <ProjectMentor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/career-hub"
              element={
                <ProtectedRoute>
                  <Internships />
                </ProtectedRoute>
              }
            />

            {/* 4. Preserved Course & Learning Routes */}
            <Route
              path="/dashboard/my-courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/learning-path"
              element={
                <ProtectedRoute>
                  <LearningPath />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-path"
              element={
                <ProtectedRoute>
                  <LearningPath />
                </ProtectedRoute>
              }
            />

            {/* 5. Protected Administrator Portal Pages */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/internships"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminInternships />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* 6. Catch-All 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
