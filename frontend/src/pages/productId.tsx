import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creatingConversation, setCreatingConversation] = useState(false);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product || res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("No se pudo cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const handleStartConversation = async () => {
    if (!currentUserId) {
      alert("Debes iniciar sesión para contactar al vendedor");
      navigate("/login");
      return;
    }

    try {
      setCreatingConversation(true);
      const res = await api.post("/conversations", {
        productId: product?._id,
      });

      const conversationId = res.data._id || res.data.conversation?._id;
      if (conversationId) {
        navigate(`/conversations/${conversationId}`);
      } else {
        alert("No se pudo obtener el ID de la conversación.");
      }
    } catch (err: any) {
      console.error("❌ Error al crear conversación:", err);
      if (err.response?.status === 401) {
        alert("Tu sesión expiró. Por favor inicia sesión nuevamente.");
        navigate("/login");
      } else {
        alert("Hubo un error al iniciar la conversación.");
      }
    } finally {
      setCreatingConversation(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading">⏳ Cargando producto...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="error-alert">{error}</div>
        <button onClick={() => navigate("/products")}>← Volver a productos</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-wrapper">
        <div className="error-alert">No se encontró el producto.</div>
        <button onClick={() => navigate("/products")}>← Volver a productos</button>
      </div>
    );
  }

  const isOwner = product.sellerId._id === currentUserId;

  return (
    <div className="page-wrapper">
      <button onClick={() => navigate("/products")} className="mb-2">
        ← Volver a productos
      </button>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Encabezado del producto */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "40px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "15px", color: "white" }}>
            {product.name}
          </h1>
          <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>
            ${product.price.toFixed(2)}
          </div>
        </div>

        {/* Descripción */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h2 style={{ color: "#333", marginBottom: "15px", fontSize: "1.4rem" }}>
            📄 Descripción
          </h2>
          <p style={{ color: "#666", lineHeight: "1.8", fontSize: "1.05rem" }}>
            {product.description || "Sin descripción disponible."}
          </p>
        </div>

        {/* Información del vendedor */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h3 style={{ color: "#333", marginBottom: "15px", fontSize: "1.2rem" }}>
            👤 Vendedor
          </h3>
          <p style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
            <Link to={`/user/${product.sellerId._id}`}>
              <strong>{product.sellerId.name}</strong>
            </Link>
          </p>
          <p style={{ color: "#999", fontSize: "0.9rem" }}>
            📅 Publicado el {new Date(product.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Botón de contacto */}
        {!isOwner && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleStartConversation}
              disabled={creatingConversation}
              style={{
                fontSize: "1.1rem",
                padding: "15px 40px",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              {creatingConversation ? "⏳ Iniciando chat..." : "💬 Contactar al vendedor"}
            </button>
            <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "10px" }}>
              Inicia una conversación para hacer preguntas sobre este producto
            </p>
          </div>
        )}

        {isOwner && (
          <div
            style={{
              background: "#e3f2fd",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              border: "1px solid #90caf9",
            }}
          >
            <p style={{ color: "#1976d2", fontWeight: 500, marginBottom: "15px" }}>
              ℹ️ Este es tu producto
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => navigate(`/products/edit/${product._id}`)}
                className="secondary"
              >
                ✏️ Editar
              </button>
              <button onClick={() => navigate("/products/mine")} className="secondary">
                📦 Ver mis productos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;