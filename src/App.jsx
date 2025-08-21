import React, { useReducer, useEffect, useState } from 'react';

// Define el estado inicial del formulario
const initialState = {
  name: '',
  email: '',
  birthdate: '',
  username: '',
  password: '',
  // Estado para los mensajes de error de validación
  errors: {
    name: '',
    email: '',
    birthdate: '',
    username: '',
    password: '',
  },
  isFormValid: false,
};

// El "reducer" que maneja la lógica de estado del formulario
function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      // Actualiza el valor de un campo específico
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: '', // Borra el error del campo al escribir
        },
      };
    case 'SET_ERROR':
      // Establece un mensaje de error para un campo
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.message,
        },
        isFormValid: false,
      };
    case 'SET_FORM_VALID':
      // Establece el estado de validez del formulario
      return {
        ...state,
        isFormValid: action.isValid,
      };
    case 'RESET_FORM':
      // Restablece el formulario a su estado inicial
      return initialState;
    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}

export default function App() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Expresiones regulares para validación
  const regex = {
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[a-zA-Z0-9_]{5,15}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      const { name, email, birthdate, username, password } = JSON.parse(savedFormData);
      dispatch({ type: 'UPDATE_FIELD', field: 'name', value: name });
      dispatch({ type: 'UPDATE_FIELD', field: 'email', value: email });
      dispatch({ type: 'UPDATE_FIELD', field: 'birthdate', value: birthdate });
      dispatch({ type: 'UPDATE_FIELD', field: 'username', value: username });
      dispatch({ type: 'UPDATE_FIELD', field: 'password', value: password });
    }

    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
  }, []);

  const validateField = (field, value) => {
    if (field === 'birthdate') {
      const birthdate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthdate.getFullYear();
      if (age < 18) {
        dispatch({ type: 'SET_ERROR', field, message: 'Debes ser mayor de 18 años.' });
        return false;
      }
    } else if (!value || !regex[field].test(value)) {
      let message = 'Campo inválido.';
      if (field === 'password') {
        message = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
      } else if (field === 'username') {
        message = 'El usuario debe tener entre 5 y 15 caracteres (letras, números o guion bajo).';
      }
      dispatch({ type: 'SET_ERROR', field, message });
      return false;
    }
    return true;
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage(null);
    setSubmitError(null);

    const formFields = ['name', 'email', 'birthdate', 'username', 'password'];
    const allFieldsValid = formFields.every(field => validateField(field, state[field]));

    if (allFieldsValid) {
      const newUser = {
        name: state.name,
        email: state.email,
        username: state.username,
        birthdate: state.birthdate
      };

      const currentUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = [...currentUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      setRegisteredUsers(updatedUsers);

      setSubmitMessage('Formulario enviado con éxito y usuario guardado!');
      dispatch({ type: 'RESET_FORM' }); 
    } else {
      setSubmitError('Por favor, corrige los errores del formulario.');
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card border-0 rounded-4 shadow-lg p-4 w-100">
              <div className="card-body">
                <h1 className="card-title display-5 fw-bold text-center text-dark mb-4">
                  Formulario de Registro
                </h1>
                
                {submitMessage && (
                  <div className="alert alert-success" role="alert">
                    {submitMessage}
                  </div>
                )}

                {submitError && (
                  <div className="alert alert-danger" role="alert">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mb-4">
                  {['name', 'email', 'birthdate', 'username', 'password'].map((field) => (
                    <div key={field} className="mb-3">
                      <label
                        htmlFor={field}
                        className="form-label text-secondary fw-bold"
                      >
                        {field.replace('birthdate', 'Fecha de Nacimiento')
                  .replace('username', 'Usuario')
                  .replace('name', 'Nombre')
                  .replace('email', 'Correo')
                  .replace('password', 'Contraseña')}
                      </label>
                      <input
                        type={field === 'password' || field === 'email' ? field : 'text'}
                        id={field}
                        name={field}
                        value={state[field]}
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field, value: e.target.value })}
                        onBlur={(e) => validateField(field, e.target.value)}
                        className={`form-control ${state.errors[field] ? 'is-invalid' : ''}`}
                        placeholder={`Introduce tu ${field.replace('birthdate', 'Fecha de Nacimiento')
                        .replace('username', 'Usuario')
                        .replace('name', 'Nombre')
                        .replace('email', 'Correo')
                        .replace('password', 'Contraseña')}`}
                      />
                      {state.errors[field] && (
                        <div className="invalid-feedback">{state.errors[field]}</div>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-bold shadow-lg"
                  >
                    Registrar
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 rounded-4 shadow-lg p-4 w-100">
              <div className="card-body">
                <h2 className="card-title h4 fw-bold text-center text-dark mb-4">
                  Usuarios Registrados
                </h2>
                {registeredUsers.length > 0 ? (
                  <div className="list-group">
                    {registeredUsers.map((user, index) => (
                      <div key={index} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1 fw-bold">{user.name}</h5>
                          <p className="mb-1 text-muted">{user.email}</p>
                        </div>
                        <small className="text-secondary">{user.username}</small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted fst-italic">No hay usuarios registrados aún.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
