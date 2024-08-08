import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './Theme';
import './Styles/global.scss';

import { LandingPage, Register, PropertiesHome, Users, ImageView, ImageApproval, Error401, Error404, Error501 } from './Pages';
import { Header, Footer } from './Components';
import { Provider } from 'react-redux';
import store from './store';

// For testing
const isAdmin = true;

const AppContent = () => {
  const location = useLocation();
  const noHeaderRoutes = ['/Home', '/Register'];

  return (
    <>
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Navigate replace to="/Home" />} />
        <Route path="/Home" element={<LandingPage />} />
        <Route path="/Register" element={<Register />} />
        {isAdmin && <Route path="/AdminHome" element={<PropertiesHome />} />}
        {!isAdmin && <Route path="/Properties" element={<PropertiesHome />} />}
        <Route path="/Users" element={<Users />} />
        <Route path="/ImageView" element={<ImageView />} />
        <Route path="/ImageApproval" element={<ImageApproval />} />
        <Route path="/Error401" element={<Error401 />} />
        <Route path="/Error404" element={<Error404 />} />
        <Route path="/Error501" element={<Error501 />} />
      </Routes>
      {!noHeaderRoutes.includes(location.pathname) && <Footer />}
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
