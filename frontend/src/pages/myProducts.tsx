import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

// Define el tipo de producto según tu backend
interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sellerId:string;
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
      const res = await api.get(`http://localhost:4000/api/products/mine`);
      setProducts(res.data.product);
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;