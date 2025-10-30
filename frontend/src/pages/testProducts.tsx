import React, { useEffect, useState } from "react";
import axios from "axios";

// Define el tipo de producto según tu backend
interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sellerId: {_id : string ; name : string};
  createdAt: string;
}

const TestProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProducts = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`http://localhost:4000/api/products?page=${pageNumber}`);
      setProducts(res.data.product);       // El array de productos
      setPage(res.data.page);              // Página actual
      setTotalPages(res.data.totalPages);  // Total de páginas
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Productos</h1>

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {products.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>Precio: ${p.price}</p>
            <p>Stock: {p.stock}</p>
            <small>Publicado por: {p.sellerId.name}</small>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button disabled={page <= 1} onClick={() => fetchProducts(page - 1)} style={{ marginRight: "10px" }}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => fetchProducts(page + 1)} style={{ marginLeft: "10px" }}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TestProducts;