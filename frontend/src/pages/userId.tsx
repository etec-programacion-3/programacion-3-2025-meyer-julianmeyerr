import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosInstance";

interface Seller {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
}

function UserId() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const res = await api.get(`/products/seller/${sellerId}`);

        // Tomamos el primer elemento del array seller
        const sellerData = Array.isArray(res.data.seller)
          ? res.data.seller[0]
          : res.data.seller;

        setSeller(sellerData);
        setProducts(res.data.products);
      } catch (err) {
        console.error("❌ Error al obtener vendedor:", err);
        setError("Error al obtener la información del vendedor");
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) fetchSellerData();
  }, [sellerId]);

  if (loading) return <p>Cargando información del vendedor...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!seller) return <p>No se encontró el vendedor.</p>;

  return (
    <div className="page-wrapper">
      <h1>Perfil de {seller.name}</h1>

      <h3>Productos publicados:</h3>
      {products.length > 0 ? (
        <div className="products-grid">
                {products.map((p) => (
                  <div key={p._id} className="product-card">
                    <h3><Link to={`/products/${p._id}`}>{p.name}</Link></h3>
                    <p>{p.description}</p>
                    <p className="product-price" >${p.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
      ) : (
        <p>Este vendedor aún no tiene productos publicados.</p>
      )}
    </div>
  );
}

export default UserId;
