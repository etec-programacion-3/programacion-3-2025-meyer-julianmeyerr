import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axiosInstance";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sellerId: { _id: string; name: string };
  createdAt: string;
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>(); // obtiene el id de la URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId"); // ✅ ID del usuario actual

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product || res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>No se encontró el producto.</p>;

  // ✅ Verificamos si el producto pertenece al usuario actual
  const isOwner = product.sellerId._id === currentUserId;

  return (
    <div className="page-wrapper">
      <h1>
        {product.name} - ${product.price}
      </h1>
      <p>{product.description}</p>

      {/* ✅ Mostrar el botón solo si NO soy el dueño del producto */}
      {!isOwner && (
        <button
          onClick={async () => {
            try {
              const res = await api.post("/conversations", {
                productId: product._id,
              });

              const conversationId = res.data._id || res.data.conversation?._id;
              if (conversationId) {
                window.location.href = `/conversations/${conversationId}`;
              } else {
                alert("No se pudo obtener el ID de la conversación.");
              }
            } catch (err) {
              console.error("❌ Error al crear conversación:", err);
              alert("Hubo un error al iniciar la conversación.");
            }
          }}
        >
          Iniciar conversación
        </button>
      )}

      <p>
        Publicado por:{" "}
        <Link to={`/user/${product.sellerId._id}`}>
          {product.sellerId.name}
        </Link>
      </p>
      <small>{new Date(product.createdAt).toLocaleString()}</small>
    </div>
  );
}

export default ProductDetail;
