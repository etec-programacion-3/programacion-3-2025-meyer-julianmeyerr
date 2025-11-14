import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

function NewProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { name?: string; price?: string } = {};

    if (!name.trim()) newErrors.name = "El nombre del producto es obligatorio.";
    if (price === "" || price <= 0)
      newErrors.price = "El precio debe ser mayor a 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post("/products", {
        name,
        description,
        price,
        stock: 1,
      });

      alert(" Producto publicado con éxito");
      navigate(`/products/${res.data._id}`);
    } catch (err: any) {
      console.error("❌ Error al publicar producto:", err.response?.data || err);
      alert("Hubo un error al publicar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-wrapper"
    >
      <h1>Publicar Producto</h1>

      <form onSubmit={handleSubmit} noValidate>
        {/* Nombre */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name">Nombre del producto</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: errors.name ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: "0.9em" }}>{errors.name}</p>
          )}
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              resize: "vertical",
            }}
          />
        </div>

        {/* Precio */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="price">Precio</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: "8px",
              border: errors.price ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {errors.price && (
            <p style={{ color: "red", fontSize: "0.9em" }}>{errors.price}</p>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#999" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Publicando..." : "Publicar producto"}
        </button>
      </form>
    </div>
  );
}

export default NewProduct;
