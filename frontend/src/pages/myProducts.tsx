import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance.ts";
import { useNavigate, Link } from "react-router-dom";

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sellerId: string;
  createdAt: string;
}

const MyProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/products/mine`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Producto eliminado con éxito ✅");
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      alert("No se pudo eliminar el producto ❌");
    }
  };

  return (
    <div className="page-wrapper">
      <h1>Mis Productos</h1>

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="products-grid">
        <button onClick={() => navigate("/products/new")}>Publicar Producto</button>
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <h3>
              <Link to={`/products/${p._id}`}>{p.name}</Link>
            </h3>
            <p>{p.description}</p>
            <p className="product-price">${p.price.toFixed(2)}</p>

            {/* 🔹 Botón de eliminar agregado */}
            <button onClick={() => navigate(`/products/edit/${p._id}`)}>Editar</button>
            <button className="danger" onClick={() => handleDelete(p._id)}>Eliminar producto</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
