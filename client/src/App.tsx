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
import PsychCounselor from "./pages/admin/PsychCounselor"
import Principal from "./pages/admin/Principal"
import NotAllowed from "./components/layout/NotAllowed"
import UsersPage from "./pages/admin/UsersPage"
import Evaluation from "./pages/admin/Evaluation"
import TeacherRegister from "./pages/admin/TeacherRegister"
import ClassLevels from "./pages/admin/ClassLevels"
import ClassesByLevel from "./pages/admin/ClassesByLevel"
import ClassDetails from "./pages/admin/ClassDetails"
import TeacherAuth from "./pages/teacher/TeacherAuth"
import TeacherLayout from "./layout/TeacherLayout"
import TeacherDashboard from "./pages/teacher/TeacherDashboard"
import TeacherClass from "./pages/teacher/TeacherClass"
import DisciplinaryDeputy from "./pages/admin/DisciplinaryDeputy"
import DisciplinaryDeputyReports from "./pages/admin/DisciplinaryDeputyReports"
import DisciplinaryDeputyStudent from "./pages/admin/DisciplinaryDeputyStudent"
import TeachersList from "./pages/admin/TeachersList"
import StudentAuth from "./pages/student/StudentAuth"
import StudentLayout from "./layout/StudentLayout"
import StudentDashboard from "./pages/student/StudentDashboard"
import Index from "./pages/Index"
import PrincipalStudents from "./pages/admin/PrincipalStudents"
import PrincipalReports from "./pages/admin/PrincipalReports"


function App() {
  const queryClient = new QueryClient();

  return (
    <div className="bg-slate-200 min-h-screen max-w-screen overflow-x-hidden">
      <QueryClientProvider client={queryClient}>
        <Toaster dir="rtl" theme="light" swipeDirections={['left', 'right']} duration={2000} />
        <Router>
          <Routes>
            <Route index element={<Index />} />

            <Route path="/admin/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path='' element={<Dashboard />} index />
              <Route path='register-student' element={<StudentRegister />} />
              <Route path='register-teacher' element={<TeacherRegister />} />
              <Route path='teachers' element={<TeachersList />} />
              <Route path='students' element={<StudentsPage />} />
              <Route path='academic-counseling' element={<AcademicCounseling />} />
              <Route path='educational-deputy' element={<EducationalDeputy />} />
              <Route path='psych-counselor' element={<PsychCounselor />} />
              <Route path='principal' element={<Principal />} />
              <Route path='principal/students' element={<PrincipalStudents />} />
              <Route path='principal/reports' element={<PrincipalReports />} />
              <Route path='users' element={<UsersPage />} />
              <Route path="class" element={<ClassLevels />} />
              <Route path="class/:level" element={<ClassesByLevel />} />
              <Route path="class/:level/:classname" element={<ClassDetails />} />
              <Route path='evaluation' element={<Evaluation />} />
              <Route path='disciplinary-deputy' element={<DisciplinaryDeputy />} />
              <Route path='disciplinary-deputy/students' element={<DisciplinaryDeputyStudent />} />
              <Route path='disciplinary-deputy/class-reports' element={<DisciplinaryDeputyReports />} />
              <Route path='not-allowed' element={<NotAllowed />} />
            </Route>

            <Route path="/teacher/auth" element={<TeacherAuth />} />
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="class/:classname/:day/:period" element={<TeacherClass />} />
            </Route>

            <Route path="/student/auth" element={<StudentAuth />} />
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  )
}

export default App
