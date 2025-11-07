import { Routes, Route, Link , useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import TestProducts from "./pages/products";
import UserId from "./pages/userId";
import LoginPage from "./pages/login";
import MyProducts from "./pages/myProducts";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Verificamos si hay un token guardado al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Panel de pruebas</h1>

      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/products" style={{ marginRight: "1rem" }}>Productos</Link>
        <Link to="/products/mine">Mis Productos</Link>

        {isLoggedIn ? (
          <button onClick={handleLogout}>Cerrar sesión</button>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<TestProducts />} />
        <Route path="/products" element={<TestProducts />} />
        <Route path="/user/:id" element={<UserId/>} />
        <Route path="/products/mine" element={<MyProducts/>}/>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />}
        />
        <Route path="*" element={<p>404 — Página no encontrada</p>} />
      </Routes>
    </div>
  );
}

export default App;