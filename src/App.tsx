import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import * as Pages from './Pages';
import { Header, Footer } from './Components';
import { Provider } from 'react-redux';
import store from './store';

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
          <Route path="/" element={<Navigate replace to="/Login" />} />
          <Route path="/Login" element={<Pages.LandingPage />} />
          <Route path="/Register" element={<Pages.Register />} />
          <Route path="/Home" element={<Pages.Home />} />
          <Route path="/Gallery" element={<Pages.Gallery propertyId={1}/>} />
          <Route path="/Users" element={<Pages.Users />} />
          <Route path="/EditUser" element={<Pages.EditUser />} />
          <Route path="/ImageView" element={<Pages.ImageView />} />
          <Route path="/ImageApproval" element={<Pages.ImageApproval />} />
          <Route path="/UploadManagement" element={<Pages.UploadManagement />} />
          <Route path="/Error401" element={<Pages.Error401 />} />
          <Route path="/Error404" element={<Pages.Error404 />} />
          <Route path="/Error501" element={<Pages.Error501 />} />
        </Routes>
      {!noHeaderRoutes.includes(currentPath) && <>
        <footer style={{ position: 'relative', left: '0', bottom: '0'}}>
          <Footer />
        </footer>
      </>
      }
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
