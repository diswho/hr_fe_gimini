import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import store, { RootState } from './store/store';
import LoginPage from './pages/LoginPage/LoginPage';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import EmployeesPage from './pages/EmployeesPage/EmployeesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage/EmployeeDetailPage';
import LeavePage from './pages/LeavePage/LeavePage';
import LeaveFormPage from './pages/LeaveFormPage/LeaveFormPage';
import DepartmentsPage from './pages/DepartmentsPage/DepartmentsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage/DepartmentDetailPage';
import SalaryPage from './pages/SalaryPage/SalaryPage';
import SalaryComponentFormPage from './pages/SalaryComponentFormPage/SalaryComponentFormPage';
import EmployeeSalariesPage from './pages/EmployeeSalariesPage/EmployeeSalariesPage'; // Import new page
import EmployeeSalaryFormPage from './pages/EmployeeSalaryFormPage/EmployeeSalaryFormPage'; // Import new form page
import { CssBaseline } from '@mui/material';

// Component to handle redirection for already authenticated users trying to access /login
const LoginPageWrapper: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LoginPage />;
};

// Component to handle redirection from root to /dashboard for authenticated users
const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Layout />;
}

function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<RootRedirect />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                    <Route path="employees/:employee_id" element={<EmployeeDetailPage />} />
                    <Route path="leave" element={<LeavePage />} />
                    <Route path="leave/new" element={<LeaveFormPage />} />
                    <Route path="leave/:leave_id/edit" element={<LeaveFormPage />} />
                    <Route path="departments" element={<DepartmentsPage />} />
                    <Route path="departments/:department_id" element={<DepartmentDetailPage />} />
                    <Route path="salary" element={<SalaryPage />} />
                    <Route path="salary/components/new" element={<SalaryComponentFormPage />} />
                    <Route path="salary/components/:component_id/edit" element={<SalaryComponentFormPage />} />
                    <Route path="employee-salaries" element={<EmployeeSalariesPage />} />
                    <Route path="employee-salaries/new" element={<EmployeeSalaryFormPage />} />
                    <Route path="employee-salaries/:employee_salary_id/edit" element={<EmployeeSalaryFormPage />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
