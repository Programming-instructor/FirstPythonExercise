import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Auth from "./pages/admin/Auth"
import Dashboard from "./pages/admin/Dashboard"
import AdminLayout from "./layout/AdminLayout"

function App() {

  return (
    <div className="bg-slate-200 min-h-screen min-w-screen">
      <Router>
        <Routes>
          <Route path="/admin/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
