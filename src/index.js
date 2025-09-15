import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext/AuthContext';
import { UserContextProvider } from './context/userContext/UserContext';
import { DriverContextProvider } from './context/driverContext/DriverContext';
import { AdminContextProvider } from './context/adminContext/AdminContext';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer position="top-right" autoClose={3000} />
    <AdminContextProvider>
      <DriverContextProvider>
        <UserContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </UserContextProvider>
      </DriverContextProvider>
    </AdminContextProvider>
  </React.StrictMode>
);
