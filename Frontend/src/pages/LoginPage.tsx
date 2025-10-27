import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DUMMY_USER = {
  email: "admin@admin.com",
  password: "admin123",
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
      setError("");
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F6F6] font-inter">
      <div className="flex w-full max-w-4xl md:max-w-6xl min-h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Fondo decorativo y branding */}
  <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-cover bg-center p-16" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80)' }}>
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-full p-3 mb-6 shadow">
              {/* Logo simple tipo barra */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#fff"/><rect x="16" y="12" width="4" height="24" rx="2" fill="#222"/><rect x="24" y="12" width="4" height="24" rx="2" fill="#222"/><rect x="32" y="12" width="4" height="24" rx="2" fill="#222"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Librería Ovilos</h2>
            <h3 className="text-2xl font-semibold text-white mt-8 mb-2">Todo para tu estudio y oficina</h3>
            <p className="text-white text-center mb-8">Encuentra libros, útiles escolares, material de oficina y papelería en un solo lugar. ¡Tu librería y papelería de confianza!</p>
            <div className="flex gap-2 mt-4">
              <span className="w-8 h-1 bg-white rounded-full"></span>
              <span className="w-8 h-1 bg-white rounded-full opacity-60"></span>
              <span className="w-8 h-1 bg-white rounded-full opacity-30"></span>
            </div>
          </div>
        </div>
        {/* Formulario login */}
  <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-16">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">¡BIENVENIDO!</h4>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Inicia sesión en tu cuenta</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                placeholder="************"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute right-3 top-9 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm font-semibold mb-2">{error}</div>}
            <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold text-lg mt-2 hover:bg-gray-800 transition">INGRESAR</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
