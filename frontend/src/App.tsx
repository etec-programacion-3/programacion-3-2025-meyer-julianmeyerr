import { Routes, Route, Link } from "react-router-dom";
import TestProducts from "./pages/testProducts";
import UserId from "./pages/userId";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Panel de pruebas</h1>

      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/products" style={{ marginRight: "1rem" }}>
          Productos
        </Link>
        <Link to="/users">Usuarios</Link>
      </nav>

      <Routes>
        <Route path="/products" element={<TestProducts />} />
        <Route path="/user/:id" element={<UserId/>} />
        <Route path="*" element={<p>404 — Página no encontrada</p>} />
      </Routes>
    </div>
  );
}

export default App;