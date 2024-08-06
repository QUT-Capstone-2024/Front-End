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

import { LandingPage, Register, Users, Collections, ImageView, ImageApproval, Error401, Error404, Error501 } from './Pages';
import { NavBar, CustomButton } from './Components';
import { Provider } from 'react-redux';
import store from './store';

const AppContent = () => {
  const location = useLocation();
  const noNavBarRoutes = ['/Landing', '/Register'];

  return (
    <>
      {!noNavBarRoutes.includes(location.pathname) && <NavBar />}
      {!noNavBarRoutes.includes(location.pathname) && <CustomButton buttonType='helpButton' label='Help' />}
      <Routes>
        <Route path="/" element={<Navigate replace to="/Landing" />} />
        <Route path="/Landing" element={<LandingPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/Collections" element={<Collections />} />
        <Route path="/ImageView" element={<ImageView />} />
        <Route path="/ImageApproval" element={<ImageApproval />} />
        <Route path="/Error401" element={<Error401 />} />
        <Route path="/Error404" element={<Error404 />} />
        <Route path="/Error501" element={<Error501 />} />
      </Routes>
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
