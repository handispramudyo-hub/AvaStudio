import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { PublicLayout } from "./components/ui";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";

const HomePage = lazy(() =>
  import("./pages/public").then((module) => ({ default: module.HomePage }))
);
const CatalogPage = lazy(() =>
  import("./pages/public").then((module) => ({ default: module.CatalogPage }))
);
const AvatarDetailPage = lazy(() =>
  import("./pages/public").then((module) => ({ default: module.AvatarDetailPage }))
);
const HowToOrderPage = lazy(() =>
  import("./pages/public").then((module) => ({ default: module.HowToOrderPage }))
);
const ContactPage = lazy(() =>
  import("./pages/public").then((module) => ({ default: module.ContactPage }))
);
const OrderPage = lazy(() =>
  import("./pages/public").then((module) => ({ default: module.OrderPage }))
);
const OrderSuccessPage = lazy(() =>
  import("./pages/public").then((module) => ({ default: module.OrderSuccessPage }))
);

const AdminLoginPage = lazy(() =>
  import("./pages/admin").then((module) => ({ default: module.AdminLoginPage }))
);
const DashboardPage = lazy(() =>
  import("./pages/admin").then((module) => ({ default: module.DashboardPage }))
);
const AvatarsAdminPage = lazy(() =>
  import("./pages/admin").then((module) => ({ default: module.AvatarsAdminPage }))
);
const AvatarFormPage = lazy(() =>
  import("./pages/admin").then((module) => ({ default: module.AvatarFormPage }))
);
const CategoriesAdminPage = lazy(() =>
  import("./pages/admin").then((module) => ({ default: module.CategoriesAdminPage }))
);
const OrdersAdminPage = lazy(() =>
  import("./pages/admin").then((module) => ({ default: module.OrdersAdminPage }))
);
const TestimonialsAdminPage = lazy(() =>
  import("./pages/admin").then((module) => ({ default: module.TestimonialsAdminPage }))
);
const SettingsAdminPage = lazy(() =>
  import("./pages/admin").then((module) => ({ default: module.SettingsAdminPage }))
);

function PublicRoute({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function AppLoader() {
  return (
    <div className="app-loader" role="status" aria-label="Memuat halaman">
      <span className="logo-mark">✦</span>
      <div>
        <b>AVA Studio</b>
        <span>Menyiapkan halaman...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Toaster richColors position="top-right" />
          <Suspense fallback={<AppLoader />}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <HomePage />
                  </PublicRoute>
                }
              />
              <Route
                path="/catalog"
                element={
                  <PublicRoute>
                    <CatalogPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/avatars/:slug"
                element={
                  <PublicRoute>
                    <AvatarDetailPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/how-to-order"
                element={
                  <PublicRoute>
                    <HowToOrderPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicRoute>
                    <ContactPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <PublicRoute>
                    <OrderPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/order/success"
                element={
                  <PublicRoute>
                    <OrderSuccessPage />
                  </PublicRoute>
                }
              />

              {/* ADMIN ROUTES */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/avatars"
                element={
                  <ProtectedRoute>
                    <AvatarsAdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/avatars/new"
                element={
                  <ProtectedRoute>
                    <AvatarFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/avatars/:id/edit"
                element={
                  <ProtectedRoute>
                    <AvatarFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute>
                    <CategoriesAdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <OrdersAdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials"
                element={
                  <ProtectedRoute>
                    <TestimonialsAdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <SettingsAdminPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
