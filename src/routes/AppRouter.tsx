import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import CarsPage from '../pages/CarsPage';
import CarDetailPage from '../pages/CarDetailPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminPage from '../pages/AdminPage';
import PrivateRoute from './PrivateRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import PurchasePage from '../pages/PurchasePage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas solo si NO estás logueado */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* Ruta protegida para administradores */}
      <Route
        path="/admin"
        element={
          <PrivateRoute requireAdmin>
            <AdminPage />
          </PrivateRoute>
        }
      />

      {/* Rutas públicas con layout */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/cars"
        element={
          <MainLayout>
            <CarsPage />
          </MainLayout>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <MainLayout>
            <CarDetailPage />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        }
      />
      <Route
        path="/purchase/:carId"
        element={
          <MainLayout>
            <PurchasePage />
          </MainLayout>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
