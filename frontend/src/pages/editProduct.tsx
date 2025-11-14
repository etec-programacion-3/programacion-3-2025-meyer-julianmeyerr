import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";

function EditProduct() {
  const { id } = useParams(); // ID del producto en la URL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const navigate = useNavigate();

  // Cargar datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const { name, description, price } = res.data;
        setName(name);
        setDescription(description);
        setPrice(price);
      } catch (err) {
        console.error("❌ Error al cargar producto:", err);
        alert("No se pudo cargar el producto.");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      await api.put(`/products/${id}`, {
        name,
        description,
        price,
      });

      alert("✅ Producto actualizado con éxito");
      navigate(`/products/${id}`);
    } catch (err: any) {
      console.error("❌ Error al actualizar producto:", err.response?.data || err);
      alert("Hubo un error al actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) return <p>Cargando información del producto...</p>;

  return (
    <div className="page-wrapper" >
    <div
      style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Editar Producto</h1>
      

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
            backgroundColor: loading ? "#999" : "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Guardando cambios..." : "Guardar cambios"}
        </button>
      </form>
    </div></div>
  );
}

export default EditProduct;
