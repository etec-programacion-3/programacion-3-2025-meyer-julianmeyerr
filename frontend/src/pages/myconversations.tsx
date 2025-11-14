import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance.ts";
import { Link } from "react-router-dom";

interface Member {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
}

interface LastMessage {
  senderId: string;
  content: string;
  createdAt: string;
  __v: number;
}

interface Conversation {
  _id: string;
  members: Member[];
  productId: Product;
  lastMessage: LastMessage | null;
}

interface ConversationsResponse {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  conversations: Conversation[];
}

const MyConversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rawUserId = localStorage.getItem("userId");
  const userId = rawUserId ? String(rawUserId) : null;

  const fetchConversations = async (pageNumber: number) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get<ConversationsResponse>(
        `/conversations/mine?page=${pageNumber}`
      );
      setConversations(res.data.conversations);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error al obtener las conversaciones:", err);
      setError("No se pudieron cargar las conversaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Ayer";
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="page-wrapper">
      <h1>💬 Mis Conversaciones</h1>

      {loading && <div className="loading">⏳ Cargando conversaciones...</div>}
      {error && <div className="error-alert">{error}</div>}

      {!loading && conversations.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: "3rem", marginBottom: "20px" }}>📭</p>
          <h3 style={{ color: "#666", marginBottom: "10px" }}>
            No hay conversaciones
          </h3>
          <p style={{ color: "#999" }}>
            Empieza a chatear con vendedores desde la página de productos
          </p>
          <Link to="/products">
            <button style={{ marginTop: "20px" }}>Ver productos</button>
          </Link>
        </div>
      )}

      <div className="conversations-list">
        {conversations.map((conv) => {
          const otherUser =
            conv.members.find((m) => String(m._id) !== String(userId)) ??
            conv.members[0];

          let lastMessageDisplay = "No hay mensajes aún";
          let messageTime = "";

          if (conv.lastMessage) {
            const senderId = String(conv.lastMessage.senderId);
            const isOwn = userId ? senderId === userId : false;

            let senderName = "Usuario";
            if (isOwn) {
              senderName = "Tú";
            } else {
              const senderMember =
                conv.members.find((m) => String(m._id) === senderId) ??
                otherUser;
              senderName = senderMember ? senderMember.name : "Usuario";
            }

            const content =
              conv.lastMessage.content.length > 50
                ? conv.lastMessage.content.substring(0, 50) + "..."
                : conv.lastMessage.content;

            lastMessageDisplay = `${senderName}: ${content}`;
            messageTime = formatDate(conv.lastMessage.createdAt);
          }

          return (
            <Link
              to={`/conversations/${conv._id}`}
              key={conv._id}
              className="conversation-card"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>
                    👤 {otherUser ? otherUser.name : "Usuario desconocido"}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#667eea",
                      fontWeight: 500,
                    }}
                  >
                    📦 {conv.productId?.name || "Sin producto"}
                  </p>
                </div>
                {messageTime && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#999",
                      whiteSpace: "nowrap",
                      marginLeft: "10px",
                    }}
                  >
                    {messageTime}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  margin: 0,
                  fontStyle: lastMessageDisplay === "No hay mensajes aún" ? "italic" : "normal",
                }}
              >
                {lastMessageDisplay}
              </p>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1}>
            ← Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={page === totalPages}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default MyConversations;