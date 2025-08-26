import React, { useReducer, useEffect, useState } from "react";

const initialState = {
  _id: null,
  name: "",
  email: "",
  dob: "",
  username: "",
  password: "",
  errors: {
    name: "",
    email: "",
    dob: "",
    username: "",
    password: "",
  },
};

function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${year}-${month}-${day}`;
}

function formatDateFromISO(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
// Reducer
function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: "" },
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case "RESET_FORM":
      return initialState;
    case "SET_FORM":
      return { ...state, ...action.payload };
    default:
      throw new Error("Acción desconocida");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: state.name,
      email: state.email,
      dob: state.dob,
      username: state.username,
      password: state.password,
    };

    try {
      var response = {};
      if (editing) {
        response = await fetch(`http://localhost:3000/api/users/${state._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        console.log(data);
      } else {
        response = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        console.log(data);
      }

      fetchUsers();
      dispatch({ type: "RESET_FORM" });
      setEditing(false);
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  // Cargar usuario para edición
  const handleEdit = (user) => {
    dispatch({
      type: "SET_FORM",
      payload: { ...user },
    });
    setEditing(true);
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
      await fetch(`http://localhost:3000/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">
        {editing ? "Editar Usuario" : "Registrar Usuario"}
      </h1>

      <form onSubmit={handleSubmit} className="mb-4">
        {["name", "email", "dob", "username", "password"].map((field) => (
          <div key={field} className="mb-3">
            <label className="form-label">
              {field === "name"
                ? "Nombre"
                : field === "email"
                ? "Correo"
                : field === "dob"
                ? "Fecha Nacimiento"
                : field === "username"
                ? "Usuario"
                : "Contraseña"}
            </label>
            <input
              type={field === "password" ? "password" : field === "email" ? "email" : field === "dob" ? "date" : "text"}
              className="form-control"
              value={field == 'dob'? formatDateForInput(state.dob) : state[field]}
              onChange={(e) =>
                dispatch({ type: "UPDATE_FIELD", field, value: e.target.value })
              }
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary w-100">
          {editing ? "Actualizar" : "Registrar"}
        </button>
      </form>

      <h2 className="mb-3">Usuarios Registrados</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Usuario</th>
            <th>Fecha Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{formatDateFromISO(user.dob)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
