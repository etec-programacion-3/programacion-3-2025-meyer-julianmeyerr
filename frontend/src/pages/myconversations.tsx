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

  // Normalizamos el userId a string (evita null/undefined problems)
  const rawUserId = localStorage.getItem("userId");
  const userId = rawUserId ? String(rawUserId) : null;

  const fetchConversations = async (pageNumber: number) => {
    try {
      const res = await api.get<ConversationsResponse>(
        `/conversations/mine?page=${pageNumber}`
      );
      setConversations(res.data.conversations);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error al obtener las conversaciones:", err);
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

  if (!conversations.length) return (<div><h1>Mis Conversaciones</h1><p>No hay conversaciones.</p></div>);

  return (
    <div>
      <h1>Mis Conversaciones</h1>

      {conversations.map((conv) => {
        // ------------------------------
        // 1) Encontrar "el otro" usuario
        // ------------------------------
        // Convertimos ambos a string para comparar de forma fiable
        const otherUser =
          conv.members.find((m) => String(m._id) !== String(userId)) ??
          conv.members[0]; // fallback seguro

        // ------------------------------
        // 2) Preparar texto de último mensaje
        // ------------------------------
        let lastMessageDisplay = "No hay mensajes aún";

        if (conv.lastMessage) {
          // normalizamos senderId (por si acaso viene como objeto/string)
          const senderId = String(conv.lastMessage.senderId);

          const isOwn = userId ? senderId === userId : false;

          // Si no es propio, preferimos el nombre del miembro que coincida con senderId
          // (por si el sender no es exactly otherUser)
          let senderName = "Usuario";
          if (isOwn) {
            senderName = "Yo";
          } else {
            // Tratamos de encontrar al miembro por el senderId
            const senderMember =
              conv.members.find((m) => String(m._id) === senderId) ?? otherUser;
            senderName = senderMember ? senderMember.name : "Usuario";
          }

          lastMessageDisplay = `${senderName}: ${conv.lastMessage.content}`;
        }

        return (
          <Link to={`/conversations/${conv._id}`} key={conv._id}><div
            
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}>
            <h3>{conv.productId?.name || "Sin producto"} - {otherUser ? otherUser.name : "Usuario desconocido"}</h3>
            <p>{lastMessageDisplay}</p>
          </div></Link>
        );
      })}

      <div>
        <button onClick={handlePrevPage} disabled={page === 1}>
          Anterior
        </button>
        <span>
          {" "}
          Página {page} de {totalPages}{" "}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default MyConversations;
