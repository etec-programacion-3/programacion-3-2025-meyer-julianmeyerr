import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Products from "./pages/products";
import UserId from "./pages/userId";
import LoginPage from "./pages/login";
import MyProducts from "./pages/myProducts";
import MyConversations from "./pages/myconversations";
import ChatPage from "./pages/chat";
import ProductDetail from "./pages/productId";
import NewProduct from "./pages/newProduct";
import RegisterPage from "./pages/register";
import EditProduct from "./pages/editProduct";
import "./styles.css"; // Importar estilos

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Seguro que deseas salir?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🛒 E-Commerce</h1>

        <nav className="nav-buttons">
          <button onClick={() => navigate("/products")}>🏠 Productos</button>
          <button onClick={() => navigate("/products/mine")}>📦 Mis Productos</button>
          <button onClick={() => navigate("/conversations")}>💬 Conversaciones</button>

          {isLoggedIn ? (
            <button className="danger" onClick={handleLogout}>
              🚪 Cerrar sesión
            </button>
          ) : (
            <button onClick={() => navigate("/login")}>🔑 Acceder</button>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/user/:sellerId" element={<UserId />} />
          <Route path="/products/mine" element={<MyProducts />} />
          <Route path="/products/new" element={<NewProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/conversations" element={<MyConversations />} />
          <Route path="/conversations/:id" element={<ChatPage />} />
          <Route
            path="/register"
            element={<RegisterPage onRegisterSuccess={() => setIsLoggedIn(true)} />}
          />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />}
          />
          <Route path="*" element={<div className="page-wrapper"><p>404 — Página no encontrada</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;