import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

interface RegisterPageProps {
  onRegisterSuccess: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setToken("");

    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      const { token, _id, name: userName } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);
      localStorage.setItem("userName", userName);

      setToken(token);

      // ✅ Notificar al componente App que hay sesión activa
      onRegisterSuccess();

      // ✅ Redirigir
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Crear cuenta
        </button>
      </form>
      <p style={{textAlign: "center"}}>¿Ya tienes cuenta? <Link to={`/login`}>Inicia Sesión</Link></p>
      {token && (
        <div style={{ marginTop: "10px", color: "green" }}>
          ✅ Registro exitoso
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;