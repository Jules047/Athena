import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Administrators from './components/Dashboard/Administrators/Administrators';
import IntranetSettings from './components/Dashboard/Parametre_intranet/IntranetSettings';
import FabricationOrders from './components/Dashboard/FabricationOrders';
import DailyReports from './components/Dashboard/DailyReports';
import Messaging from './components/Dashboard/Messaging';
import Agenda from './components/Dashboard/Agenda';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="administrators" element={<Administrators />} />
        <Route path="intranet-settings" element={<IntranetSettings />} />
        <Route path="fabrication-orders" element={<FabricationOrders />} />
        <Route path="daily-reports" element={<DailyReports />} />
        <Route path="messaging" element={<Messaging />} />
        <Route path="agenda" element={<Agenda />} />
    </Routes>
  );
};

export default App;
