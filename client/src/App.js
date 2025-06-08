import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AssignmentDashboard from './components/AssignmentDashboard';
import EngineerList from './page/EngineerList';
import EngineerDashboard from './components/EngineerDashboard';
import ProtectedRoute from './routes/ProtectedRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/*  Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['engineer', 'manager']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/assignments"
              element={
                <ProtectedRoute roles={['engineer', 'manager']}>
                  <AssignmentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/engineers"
              element={
                <ProtectedRoute roles={['manager']}>
                  <EngineerList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/engineers"
              element={
                <ProtectedRoute roles={['engineer']}>
                  <EngineerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
