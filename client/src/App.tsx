import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Auth from "./pages/admin/Auth"
import Dashboard from "./pages/admin/Dashboard"
import AdminLayout from "./layout/AdminLayout"
import StudentRegister from "./pages/admin/StudentRegister"
import { Toaster } from "sonner"
import StudentsPage from "./pages/admin/Students"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AcademicCounseling from "./pages/admin/AcademicCounseling"
import EducationalDeputy from "./pages/admin/EducationalDeputy"


function App() {
  const queryClient = new QueryClient();

  return (
    <div className="bg-slate-200 min-h-screen max-w-screen overflow-x-hidden">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/admin/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='register-student' element={<StudentRegister />} />
              <Route path='students' element={<StudentsPage />} />
              <Route path='academic-counseling' element={<AcademicCounseling />} />
              <Route path='educational-deputy' element={<EducationalDeputy />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  )
}

export default App
