import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsersDashboard from '../pages/AdminUsersDashboard';
import Admin3DModelsDashboard from '../pages/Admin3DModelsDashboard';
import AdminSupportDashboard from '../pages/AdminSupportDashboard';
import AdminActivityLogsDashboard from '../pages/AdminActivityLogsDashboard';
import AdminSystemErrorsDashboard from '../pages/AdminSystemErrorsDashboard';
import AdminPlatformSettingsDashboard from '../pages/AdminPlatformSettingsDashboard';
import About from '../pages/About';
import Converter from '../pages/Converter';
import Packs from '../pages/Packs';
import Contact from '../pages/Contact';
import Faq from '../pages/Faq';
import ARHome from '../pages/ARHome';
import ARExperiences from '../pages/ARExperiences';
import ARPlatformExperience from '../pages/ARPlatformExperience';
import ARMobileView from '../pages/ARMobileView';
import PublicARExperience from '../pages/PublicARExperience';
import AR from '../pages/AR';
import ConversionPipeline from '../pages/ConversionPipeline';
import Register from '../pages/Register';
import Welcome from '../pages/Welcome';
import Profile from '../pages/Profile';
import ModelsManagement from '../pages/ModelsManagement';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Router configuration for JOJMA.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'welcome', element: <Welcome /> },
      { path: 'about', element: <About /> },
      {
        path: 'services',
        children: [
          { index: true, element: <div className="p-20 text-center">Nos Services (En construction)</div> },
          { path: 'convertisseur', element: <Converter /> },
          { path: 'packs-ar', element: <Packs /> },
        ]
      },
      {
        path: 'ar',
        children: [
          { index: true, element: <ARHome /> },
          { path: 'experiences', element: <ARExperiences /> },
          { path: 'experiences/:platform', element: <ARPlatformExperience /> },
          { path: 'view', element: <ARMobileView /> },
        ]
      },
      { path: 'view/:slug', element: <PublicARExperience /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <Faq /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'models', element: <ModelsManagement /> },
      { path: 'conversions', element: <ConversionPipeline /> },
      { path: 'ar', element: <AR /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsersDashboard /> },
      { path: 'models', element: <Admin3DModelsDashboard /> },
      { path: 'support', element: <AdminSupportDashboard /> },
      { path: 'logs', element: <AdminActivityLogsDashboard /> },
      { path: 'errors', element: <AdminSystemErrorsDashboard /> },
      { path: 'settings', element: <AdminPlatformSettingsDashboard /> },
    ],
  },
  {
    path: '*',
    element: <div className="h-screen flex items-center justify-center">404 - Page non trouvée</div>,
  },
]);
