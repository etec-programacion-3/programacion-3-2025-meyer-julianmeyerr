import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";

interface User {
  _id: string;
  name: string;
  email: string;
}

function UserDetail() {
  const { id } = useParams<{ id: string }>(); // obtiene el id de la URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${id}`);
      setUser(res.data.user || res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>No se encontró el usuario.</p>;

  return (
    <div>
      <h2>Detalle del Usuario</h2>
      <p><strong>ID:</strong> {user._id}</p>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default UserDetail;
