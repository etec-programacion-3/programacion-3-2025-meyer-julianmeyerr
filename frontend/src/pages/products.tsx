import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sellerId: { _id: string; name: string };
  createdAt: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState("");

  const fetchProducts = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `http://localhost:4000/api/products?page=${pageNumber}&search=${encodeURIComponent(search)}`
      );
      setProducts(res.data.product);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
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

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="page-wrapper">
      <h1>🛍️ Catálogo de Productos</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          🔍 Buscar
        </button>
      </div>

      {loading && <div className="loading">⏳ Cargando productos...</div>}
      {error && <div className="error-alert">{error}</div>}

      <div className="products-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <h3>
              <Link to={`/products/${p._id}`}>{p.name}</Link>
            </h3>
            <p>{p.description}</p>
            <p className="product-price">${p.price.toFixed(2)}</p>
            <small className="product-seller">
              Publicado por: <Link to={`/user/${p.sellerId._id}`}>{p.sellerId.name}</Link>
            </small>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center mt-3">
          <p>No se encontraron productos</p>
        </div>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => fetchProducts(page - 1)}>
          ← Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => fetchProducts(page + 1)}>
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default Products;