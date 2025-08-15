import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Auth from "./pages/admin/Auth"
import Dashboard from "./pages/admin/Dashboard"
import AdminLayout from "./layout/AdminLayout"
import StudentRegister from "./pages/admin/StudentRegister"
import { Toaster } from "sonner"
import StudentsPage from "./pages/admin/Students"

function App() {

  return (
    <div className="bg-slate-200 min-h-screen max-w-screen overflow-x-hidden">
      <Toaster />
      <Router>
        <Routes>
          <Route path="/admin/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='register-student' element={<StudentRegister />} />
            <Route path='students' element={<StudentsPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
