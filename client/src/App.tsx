import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Auth from "./pages/admin/auth"

function App() {

  return (
    <div className="bg-slate-200 min-h-screen min-w-screen">
      <Router>
        <Routes>
          <Route path="/admin">
            <Route path="auth" element={<Auth />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
