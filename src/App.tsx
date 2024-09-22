import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import ProtectedRoute from './HelperFunctions/ProtectedRoute';
import * as Pages from './Pages';
import { Header, Footer } from './Components';
import { ThemeProvider } from '@mui/material';
import theme from './Theme';
import './Styles/global.scss';

const AppContent = () => {
  const location = useLocation();
  const noHeaderRoutes = ['/login', '/register', '/error401', '/error404', '/error501'];
  const currentPath = location.pathname.toLowerCase();

  return (
    <>
      {!noHeaderRoutes.includes(currentPath) && <Header />}
      <Routes>
        {/* Public/Guest Routes */}
        <Route path="/" element={<Navigate replace to="/Login" />} />
        <Route path="/Login" element={<Pages.LandingPage />} />
        <Route path="/Register" element={<Pages.Register />} />
        <Route path="/Terms-and-Conditions" element={<Pages.Terms />} />

        {/* Protected Routes with varying access levels */}
        <Route element={<ProtectedRoute requiredAuthLevel={1} />}>
          <Route path="/Home" element={<Pages.Home />} />
          <Route path="/Gallery/:propertySlug" element={<Pages.Gallery />} />
        </Route>

        <Route element={<ProtectedRoute requiredAuthLevel={3} />}>
          <Route path="/ImageApproval" element={<Pages.ImageApproval />} />
          <Route path="/UploadManagement" element={<Pages.UploadManagement />} />
        </Route>

        <Route element={<ProtectedRoute requiredAuthLevel={4} />}>
          <Route path="/EditUser" element={<Pages.EditUser />} />
        </Route>

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Pages.Unauthorized />} />

        {/* Error Routes */}
        <Route path="/Error404" element={<Pages.Error404 />} />
        <Route path="*" element={<Navigate to="/Error404" replace />} />
      </Routes>
      {/* {!noHeaderRoutes.includes(currentPath) && <Footer />} */}
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
