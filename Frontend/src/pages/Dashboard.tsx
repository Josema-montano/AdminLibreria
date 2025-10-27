import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ProductoDTO, ClienteDTO, ProveedorDTO, PromocionDTO } from "../types";
import {
  PRODUCTOS_API_URL,
  CLIENTES_API_URL,
  PROVEEDORES_API_URL,
  PROMOCIONES_API_URL,
} from "../config/api";
import {
  Package,
  Users,
  Truck,
  Tag,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Bell,
  CircleUser,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";
import ErrorConnection from "../components/ErrorConnection.tsx";

const Dashboard: React.FC = () => {
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [promociones, setPromociones] = useState<PromocionDTO[]>([]);
  const [devoluciones, setDevoluciones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setConnectionError(false);
    try {
      const [productosRes, clientesRes, , promocionesRes, devolucionesRes] =
        await Promise.all([
          axios.get<ProductoDTO[]>(PRODUCTOS_API_URL).catch(() => ({ data: [] })),
          axios.get<ClienteDTO[]>(CLIENTES_API_URL).catch(() => ({ data: [] })),
          axios.get<ProveedorDTO[]>(PROVEEDORES_API_URL).catch(() => ({ data: [] })),
          axios.get<PromocionDTO[]>(PROMOCIONES_API_URL).catch(() => ({ data: [] })),
          axios.get<any[]>('/api/Devoluciones').catch(() => ({ data: [] })),
        ]);

      setProductos(productosRes.data || []);
      setClientes(clientesRes.data || []);
      setPromociones(promocionesRes.data || []);
      setDevoluciones(devolucionesRes.data || []);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      // Si hay error de red, mostrar mensaje de conexión
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setConnectionError(true);
      }
      // Si hay error, establecer arrays vacíos
  setProductos([]);
  setClientes([]);
  setPromociones([]);
    } finally {
      setLoading(false);
    }
  };

  const productosConAlerta = productos.filter(
    (p) => p.stock <= p.stockMinimo
  );
  const productosSinStock = productos.filter((p) => p.stock === 0);
  const promocionesActivas = promociones.filter((p) => p.activa);

  const valorTotalInventario = productos.reduce(
    (total, p) => total + p.precioVenta * p.stock,
    0
  );

  return (
    <div className="max-w-full min-h-screen bg-[#F6F6F6]">
      {/* Header blanco con barra de búsqueda y usuario */}
      <div className="w-full bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Bienvenido de nuevo, Administrador</h1>
          <p className="text-gray-500 text-sm">Aquí están las estadísticas de hoy de tu librería</p>
        </div>
        <div className="flex items-center gap-6">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Administrador</span>
            <CircleUser className="text-gray-400" size={32} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      ) : connectionError ? (
        <ErrorConnection onRetry={cargarDatos} />
      ) : (
        <>
          {/* Tarjetas de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pt-8">
            {/* Tarjeta principal negra */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between relative col-span-1 md:col-span-1">
              <div className="flex items-center gap-4 mb-2">
                <Package className="text-white" size={40} />
                <span className="text-lg font-semibold">Total Productos</span>
              </div>
              <div className="text-4xl font-extrabold mb-1">{productos.length}</div>
              <div className="text-sm text-gray-300 mb-2">Inventario: Bs {valorTotalInventario.toLocaleString("es-BO", { minimumFractionDigits: 2 })}</div>
              <div className="flex gap-6 text-xs opacity-80">
                <span className="flex items-center gap-1 text-green-400 font-bold">+15.6% <ArrowUpRight size={16} /></span>
                <span className="text-gray-300">+1.4k esta semana</span>
              </div>
              <div className="absolute top-4 right-4"><ChevronRight className="text-white" size={28} /></div>
              <div className="text-xs text-gray-400 mt-2">{productos.length > 1 ? `${productos.length} productos` : `${productos.length} producto`}</div>
            </div>
            {/* Tarjeta secundaria blanca - Clientes */}
            <div className="bg-white rounded-2xl shadow p-8 border border-gray-100 flex flex-col justify-between relative">
              <div className="flex items-center gap-4 mb-2">
                <Users className="text-gray-900" size={40} />
                <span className="text-lg font-semibold text-gray-700">Clientes</span>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{clientes.length}</div>
              <div className="text-xs text-gray-500 mb-2">Tiempo promedio: 4:30m</div>
              <div className="flex gap-6 text-xs">
                <span className="flex items-center gap-1 text-green-600 font-bold">+12.7% <ArrowUpRight size={16} /></span>
                <span className="text-gray-500">+1.2k esta semana</span>
              </div>
              <div className="absolute top-4 right-4"><ChevronRight className="text-gray-400" size={28} /></div>
            </div>
            {/* Tarjeta secundaria blanca - Devoluciones */}
            <div className="bg-white rounded-2xl shadow p-8 border border-gray-100 flex flex-col justify-between relative">
              <div className="flex items-center gap-4 mb-2">
                <TrendingUp className="text-gray-900" size={40} />
                <span className="text-lg font-semibold text-gray-700">Devoluciones</span>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{devoluciones.length}</div>
              <div className="text-xs text-gray-500 mb-2">2 Disputadas</div>
              <div className="flex gap-6 text-xs">
                <span className="flex items-center gap-1 text-red-600 font-bold">-12.7% <ArrowDownRight size={16} /></span>
                <span className="text-gray-500">-213</span>
              </div>
              <div className="absolute top-4 right-4"><ChevronRight className="text-gray-400" size={28} /></div>
            </div>
          </div>
          {/* Alertas y Resumen */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 px-8 pt-8">
            {/* Alertas de Stock */}
            <div className="bg-white rounded-2xl shadow flex flex-col justify-between p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <AlertTriangle className="text-[#E3B505]" size={36} />
                <span className="text-lg font-semibold text-gray-700">Alertas de Stock</span>
              </div>
              <div className="mb-4">
                {productosConAlerta.length > 0 ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {productosConAlerta.slice(0, 5).map((producto) => (
                      <div
                        key={producto.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          producto.stock === 0
                            ? "bg-red-50 border-[#F25C5C]"
                            : "bg-yellow-50 border-[#E3B505]"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{producto.nombre}</p>
                            <p className="text-sm text-gray-500">Código: {producto.codigo}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${producto.stock === 0 ? "text-[#F25C5C]" : "text-[#E3B505]"}`}>{producto.stock}</p>
                            <p className="text-xs text-gray-400">Min: {producto.stockMinimo}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {productosConAlerta.length > 5 && (
                      <Link to="/inventario" className="block text-center text-gray-900 font-medium text-sm py-2">Ver {productosConAlerta.length - 5} más →</Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-2">✅</p>
                    <p>No hay alertas de stock</p>
                    <p className="text-sm">Todos los productos están bien abastecidos</p>
                  </div>
                )}
              </div>
              <Link to="/inventario" className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-700 transition mt-2">Ver Inventario</Link>
            </div>
            {/* Resumen Inventario */}
            <div className="bg-gray-900 rounded-2xl shadow flex flex-col justify-between p-8 text-white border border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <DollarSign className="text-white" size={36} />
                <span className="text-lg font-semibold">Resumen del Inventario</span>
              </div>
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-1">Valor Total del Inventario</p>
                <p className="text-4xl font-bold">Bs {valorTotalInventario.toLocaleString("es-BO", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <p className="text-gray-300 text-sm mb-1">Productos con Alerta</p>
                  <p className="text-2xl font-bold">{productosConAlerta.length}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-1">Sin Stock</p>
                  <p className="text-2xl font-bold">{productosSinStock.length}</p>
                </div>
              </div>
              <Link to="/productos" className="block w-full bg-white text-gray-900 text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition mt-4">Ver Todos los Productos</Link>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Accesos Rápidos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/productos" className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl hover:shadow-md transition">
                <Package className="text-gray-900 mb-2" size={40} />
                <span className="font-semibold text-gray-900">Productos</span>
              </Link>
              <Link to="/clientes" className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl hover:shadow-md transition">
                <Users className="text-gray-900 mb-2" size={40} />
                <span className="font-semibold text-gray-900">Clientes</span>
              </Link>
              <Link to="/proveedores" className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl hover:shadow-md transition">
                <Truck className="text-gray-900 mb-2" size={40} />
                <span className="font-semibold text-gray-900">Proveedores</span>
              </Link>
              <Link to="/promociones" className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl hover:shadow-md transition">
                <Tag className="text-gray-900 mb-2" size={40} />
                <span className="font-semibold text-gray-900">Promociones</span>
              </Link>
              <Link to="/devoluciones" className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl hover:shadow-md transition">
                <TrendingUp className="text-gray-900 mb-2" size={40} />
                <span className="font-semibold text-gray-900">Devoluciones</span>
              </Link>
              <Link to="/inventario" className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl hover:shadow-md transition">
                <ShoppingCart className="text-gray-900 mb-2" size={40} />
                <span className="font-semibold text-gray-900">Inventario</span>
              </Link>
            </div>
          </div>

          {/* Promociones Activas */}
          {promocionesActivas.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Tag className="text-yellow-500" />
                  Promociones Activas
                </h2>
                <Link
                  to="/promociones"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Ver Todas →
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {promocionesActivas.slice(0, 3).map((promocion) => (
                  <div
                    key={promocion.id}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200"
                  >
                    <h3 className="font-bold text-gray-800 mb-2">
                      {promocion.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {promocion.descripcion}
                    </p>
                    <p className="text-xs text-gray-500">
                      Válido: {new Date(promocion.fechaInicio).toLocaleDateString()} - {new Date(promocion.fechaFin).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
