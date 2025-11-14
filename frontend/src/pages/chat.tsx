import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

interface User {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
}

interface Message {
  _id: string;
  senderId: User;
  content: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  members: User[];
  productId: Product;
}

function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/conversations/${id}`);
      setConversation(res.data.conversation);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error al cargar conversación:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post(`/messages`, {
        conversationId: id,
        content: newMessage,
      });

      const currentUserName = localStorage.getItem("userName") || "Yo";

      const messageWithSender = {
        ...res.data,
        senderId: {
          _id: currentUserId,
          name: currentUserName,
        },
      };

      setMessages((prev) => [...prev, messageWithSender]);
      setNewMessage("");
    } catch (err: any) {
      console.error("Error al enviar mensaje:", err.response?.data || err);
    }
  };

  useEffect(() => {
    if (id) fetchConversation();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading">⏳ Cargando conversación...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="page-wrapper">
        <div className="error-alert">No se encontró la conversación.</div>
        <button onClick={() => navigate("/conversations")}>← Volver</button>
      </div>
    );
  }

  const otherUser =
    conversation.members.find((m) => m._id !== currentUserId)?.name || "Usuario";

  const otherUserId =
    conversation.members.find((m) => m._id !== currentUserId)?._id || "";

  return (
    <div className="page-wrapper">
      <button onClick={() => navigate("/conversations")} className="mb-2">
        ← Volver a conversaciones
      </button>

      <div className="chat-container">
        {/* Encabezado */}
        <div className="chat-header">
          <h3>
            💬 Chat con{" "}
            <Link to={`/user/${otherUserId}`} style={{ color: "white" }}>
              {otherUser}
            </Link>
          </h3>
          {conversation.productId && (
            <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", opacity: 0.9 }}>
              📦 Producto:{" "}
              <Link
                to={`/products/${conversation.productId._id}`}
                style={{ color: "white", textDecoration: "underline" }}
              >
                {conversation.productId.name}
              </Link>
            </p>
          )}
        </div>

        {/* Mensajes */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
              <p>📭 No hay mensajes aún.</p>
              <p style={{ fontSize: "0.9rem" }}>¡Sé el primero en escribir!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId?._id === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={`message ${isMine ? "mine" : "theirs"}`}
                  style={{
                    marginLeft: isMine ? "auto" : "0",
                    marginRight: isMine ? "0" : "auto",
                  }}
                >
                  <strong style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                    {isMine ? "Yo" : msg.senderId?.name || "Usuario"}
                  </strong>
                  <div style={{ marginTop: "5px" }}>{msg.content}</div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.6,
                      marginTop: "5px",
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Barra de input */}
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            autoFocus
          />
          <button type="submit" disabled={!newMessage.trim()}>
            📤 Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;