import { useEffect, useState, useRef } from "react";
import { useParams, Link , useNavigate} from "react-router-dom";
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

  // 🔹 Obtener conversación y mensajes
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

  // 🔹 Enviar mensaje
const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newMessage.trim()) return;

  try {
    const res = await api.post(`/messages`, {
      conversationId: id,
      content: newMessage,
    });

    // ✅ Crear una copia del mensaje con el nombre del usuario actual
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


  // 🔹 Cargar al montar
  useEffect(() => {
    if (id) fetchConversation();
  }, [id]);

  // 🔹 Auto scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <p>Cargando conversación...</p>;
  if (!conversation) return <p>No se encontró la conversación.</p>;

  const otherUser =
    conversation.members.find((m) => m._id !== currentUserId)?.name ||
    "Usuario";

  const otherUserId =
    conversation.members.find((m) => m._id !== currentUserId)?._id ||
    "";

  return (
    <div><button onClick={() => navigate(`/conversations`)}>Volver</button>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        maxWidth: "700px",
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          textAlign: "center",
          backgroundColor: "#f8f8f8",
        }}
      >
        <h3>Chat con <Link to={`/user/${otherUserId}`}>
              {otherUser}
            </Link></h3>
        {conversation.productId && (
          <p style={{ margin: 0, fontSize: "14px" }}>
            Producto:{" "}
            <Link to={`/products/${conversation.productId._id}`}>
              {conversation.productId.name}
            </Link>
          </p>
        )}
      </div>

      {/* Mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#fff",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No hay mensajes aún.
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId?._id === currentUserId;
            return (
              <div
                key={msg._id}
                style={{
                  textAlign: isMine ? "right" : "left",
                  margin: "5px 0",
                }}
              >
                <strong>
                  {isMine ? "Yo" : msg.senderId?.name || "Usuario"}:
                </strong>{" "}
                {msg.content}
                
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Barra fija para enviar */}
      <form
        onSubmit={handleSendMessage}
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#f8f8f8",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </form>
    </div></div>
  );
}

export default ChatPage;
