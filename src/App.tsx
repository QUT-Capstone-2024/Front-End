import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './Theme';
import './Styles/global.scss';

import { Home, Login, Register, Logout, Users, Collections, ImageView, ImageApproval, Error401, Error404, Error501 } from './Pages';
import { NavBar } from './Components';
import { Provider } from 'react-redux';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Logout" element={<Logout />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Collections" element={<Collections />} />
            <Route path="/ImageView" element={<ImageView />} />
            <Route path="/ImageApproval" element={<ImageApproval />} />
            <Route path="/Error401" element={<Error401 />} />
            <Route path="/Error404" element={<Error404 />} />
            <Route path="/Error501" element={<Error501 />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
