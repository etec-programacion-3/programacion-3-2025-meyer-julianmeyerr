import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate , Link} from "react-router-dom";


interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setToken("");

    try {
  const response = await axios.post("/auth/login", { email, password });
  const token = response.data.token;
  const _id = response.data._id;
  const name = response.data.name

  // ✅ Guardar el token localmente
  localStorage.setItem("token", token);
  localStorage.setItem("userId", _id);
  localStorage.setItem("userName", name)

  setToken(token);
  console.log("Token recibido:", token);
  console.log("Id recibido: ", _id)
  onLoginSuccess();
  navigate("/")
} catch (err: any) {
  setError(err.response?.data?.message || "Error al iniciar sesión");
}
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
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
          Entrar
        </button>
        
      </form>
      <p style={{textAlign: "center"}}>¿No tienes cuenta? <Link to={`/register`}>Registrate</Link></p>

      {token && (
        <div style={{ marginTop: "10px", color: "green" }}>
          ✅ Token recibido:
          <br />
          <code>{token}</code>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
