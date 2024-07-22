import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Loadable from '../src/utils/Loadable';

// Utilisation de Loadable pour charger les composants de manière dynamique
const LoadableLogin = Loadable(() => import('./components/Login'));
const LoadableForgotPassword = Loadable(() => import('./components/ForgotPassword'));
const LoadableRegister = Loadable(() => import('./components/Register'));
const LoadableDashboard = Loadable(() => import('./components/Dashboard/Dashboard'));
const LoadableAdministrators = Loadable(() => import('./components/Dashboard/Administrators/Administrators'));
const LoadableIntranetSettings = Loadable(() => import('./components/Dashboard/Parametre_intranet/IntranetSettings'));
const LoadableFabricationOrders = Loadable(() => import('./components/Dashboard/FabricationOrders'));
const LoadableDailyReports = Loadable(() => import('./components/Dashboard/DailyReports'));
const LoadableMessaging = Loadable(() => import('./components/Dashboard/Messaging'));
const LoadableAgenda = Loadable(() => import('./components/Dashboard/Agenda'));

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoadableLogin />} />
      <Route path="/forgot-password" element={<LoadableForgotPassword />} />
      <Route path="/register" element={<LoadableRegister />} />
      <Route path="/dashboard/*" element={<LoadableDashboard />}>
        <Route path="administrators" element={<LoadableAdministrators />} />
        <Route path="intranet-settings" element={<LoadableIntranetSettings />} />
        <Route path="fabrication-orders" element={<LoadableFabricationOrders />} />
        <Route path="daily-reports" element={<LoadableDailyReports />} />
        <Route path="messaging" element={<LoadableMessaging />} />
        <Route path="agenda" element={<LoadableAgenda />} />
      </Route>
    </Routes>
  );
};

export default App;
