import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import NotFound from "./pages/NotFound";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#151311",
            color: "#f6f3ee",
            borderRadius: 0,
            fontSize: "13px",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#f6f3ee", secondary: "#151311" } },
          error: { iconTheme: { primary: "#b5502f", secondary: "#f6f3ee" } },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
