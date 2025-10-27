import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Users,
  Package,
  Truck,
  Tag,
  TrendingUp,
  ShoppingCart,
  BookOpen,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <div className="flex min-h-screen bg-[#F6F6F6] font-inter">
      {/* Sidebar ancho y oscuro */}
  <aside className="w-72 bg-gray-900 text-white flex flex-col py-0 px-0 shadow-xl rounded-r-2xl sticky top-0 h-screen">
        {/* Header con logo y nombre */}
        <div className="flex items-center gap-3 px-6 py-8 bg-gray-950 rounded-tr-2xl border-b border-gray-800">
          <div className="bg-white rounded-full p-2 shadow">
            <BookOpen className="w-8 h-8 text-[#38BDF8]" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#38BDF8]">Librería Ovilos</span>
        </div>
        {/* Sección principal */}
        <div className="px-6 pt-6">
          <div className="text-xs font-bold text-gray-400 mb-2 tracking-widest">MAIN</div>
          <nav>
            <ul className="space-y-1">
              <li>
                <NavLink to="/dashboard" className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-base ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
                }>
                  <TrendingUp className="w-6 h-6 text-[#38BDF8]" />
                  <span className="font-semibold">Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/pos" className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-base ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
                }>
                  <ShoppingCart className="w-6 h-6" />
                  <span>POS / Ventas</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/productos" className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-base ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
                }>
                  <Package className="w-6 h-6" />
                  <span>Productos</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/clientes" className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-base ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
                }>
                  <Users className="w-6 h-6" />
                  <span>Clientes</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/proveedores" className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-base ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
                }>
                  <Truck className="w-6 h-6" />
                  <span>Proveedores</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/promociones" className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-base ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
                }>
                  <Tag className="w-6 h-6" />
                  <span>Promociones</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/devoluciones" className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-base ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
                }>
                  <TrendingUp className="w-6 h-6" />
                  <span>Devoluciones</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/inventario" className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-base ${isActive ? "bg-gray-800" : "hover:bg-gray-800"}`
                }>
                  <ShoppingCart className="w-6 h-6" />
                  <span>Inventario</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        {/* Sección de ajustes */}
        <div className="mt-auto px-6 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#38BDF8] text-gray-900 font-bold text-base hover:bg-[#0ea5e9] transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg>
            Cerrar sesión
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 bg-[#F6F6F6] px-0 md:px-0 py-0">
        <div className="px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
