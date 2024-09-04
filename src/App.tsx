import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import ProtectedRoute, {AuthLevels} from './HelperFunctions/ProtectedRoute';
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
          {/* Guest Routes */}
          <Route path="/" element={<Navigate replace to="/Login" />} />
          <Route path="/Login" element={<Pages.LandingPage />} />
          <Route path="/Register" element={<Pages.Register />} />

          {/* standard Routes */}
          <Route element={<ProtectedRoute requiredAuthLevel={AuthLevels.PROPERTY_OWNER} />}>
            <Route path="/Home" element={<Pages.Home />} />
            <Route path="/Gallery/:propertySlug" element={<Pages.Gallery/>} />  
          </Route>
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute requiredAuthLevel={AuthLevels.CL_USER} />}>
            <Route path="/ImageApproval" element={<Pages.ImageApproval />} />
            <Route path="/UploadManagement" element={<Pages.UploadManagement />} />
          </Route>
          <Route element={<ProtectedRoute requiredAuthLevel={AuthLevels.CL_ADMIN} />}>
            <Route path="/EditUser" element={<Pages.EditUser />} />  
          </Route>

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<Pages.Unauthorized />} />

          {/* Error Routes with catch all*/}
          <Route path="/Error404" element={<Pages.Error404 />} />
        </Routes>
      {!noHeaderRoutes.includes(currentPath) && <>
        {/* <footer style={{ position: 'relative', left: '0', bottom: '0'}}>
          <Footer />
        </footer> */}
      </>
      }
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
