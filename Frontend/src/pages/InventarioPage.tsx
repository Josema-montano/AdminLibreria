import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductoDTO, MovimientoDTO } from "../types/index";
import { INVENTARIO_API_URL, PRODUCTOS_API_URL } from "../config/api";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const InventarioPage: React.FC = () => {
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoDTO[]>([]);
  const [alertas, setAlertas] = useState<ProductoDTO[]>([]);
  const [formData, setFormData] = useState<MovimientoDTO>({
  productoId: 0,
  fecha: new Date().toISOString().slice(0,16),
  cantidad: 1,
  tipo: "Ingreso",
  motivo: "",
  referenciaId: undefined,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);

  useEffect(() => {
    listarProductos();
    listarMovimientos();
    obtenerAlertasStock();
  }, []);

  const listarProductos = async () => {
    try {
      const response = await axios.get<ProductoDTO[]>(PRODUCTOS_API_URL);
      setProductos(response.data || []);
    } catch (error: any) {
      console.error("Error al cargar productos:", error);
      if (error.response?.status === 404) {
        setProductos([]);
      }
    }
  };

  const listarMovimientos = async () => {
    setLoading(true);
    try {
      const response = await axios.get<MovimientoDTO[]>(`${INVENTARIO_API_URL}/movimientos`);
      setMovimientos(response.data || []);
    } catch (error: any) {
      console.error("Error al cargar movimientos:", error);
      if (error.response?.status === 404) {
        setMovimientos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const obtenerAlertasStock = async () => {
    try {
      const response = await axios.get<ProductoDTO[]>(`${INVENTARIO_API_URL}/alertas`);
      setAlertas(response.data || []);
    } catch (error: any) {
      try {
        const response = await axios.get<ProductoDTO[]>(PRODUCTOS_API_URL);
        const productosConAlerta = (response.data || []).filter(
          (p) => p.stock <= p.stockMinimo
        );
        setAlertas(productosConAlerta);
      } catch (error2: any) {
        console.error("Error al cargar alertas:", error2);
        if (error2.response?.status === 404) {
          setAlertas([]);
        }
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "productoId" || name === "cantidad" || name === "tipo"
          ? parseInt(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productoId === 0) {
      alert("Seleccione un producto válido.");
      return;
    }
    if (!formData.cantidad || formData.cantidad <= 0) {
      alert("Ingrese una cantidad mayor a 0.");
      return;
    }
    if (!formData.motivo || formData.motivo.trim() === "") {
      alert("Ingrese el motivo del movimiento.");
      return;
    }
    if (formData.tipo !== "Ingreso" && formData.tipo !== "Egreso") {
      alert("Seleccione un tipo de movimiento válido.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${INVENTARIO_API_URL}/actualizar`, formData);
      alert("Movimiento registrado exitosamente");
      setFormData({
        productoId: 0,
        fecha: new Date().toISOString().slice(0,16),
        cantidad: 1,
        tipo: "Ingreso",
        motivo: "",
        referenciaId: undefined,
      });
      listarMovimientos();
      listarProductos();
      obtenerAlertasStock();
    } catch (error: any) {
      alert(error.response?.data?.mensaje || "Error al registrar el movimiento");
    } finally {
      setLoading(false);
    }
  };

  const getNombreProducto = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto ? `${producto.nombre} (${producto.codigo})` : "Desconocido";
  };

  const getTipoMovimiento = (tipo: number | string) => {
    if (tipo === 1 || tipo === "Ingreso") {
      return { texto: "Ingreso", color: "bg-green-100 text-green-700", icono: <TrendingUp size={16} /> };
    }
    if (tipo === 2 || tipo === "Egreso") {
      return { texto: "Egreso", color: "bg-red-100 text-red-700", icono: <TrendingDown size={16} /> };
    }
    return { texto: "Desconocido", color: "bg-gray-100 text-gray-700", icono: null };
  };

  return (
    <div className="max-w-full w-full min-h-screen bg-[#F6F6F6] font-inter pb-16">
      {/* Header blanco con barra de búsqueda y usuario */}
      <div className="w-full bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <BarChart3 className="text-blue-600 w-6 h-6" />
            Inventario
          </h1>
          <p className="text-gray-500 text-sm">Controla movimientos y alertas de stock</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input type="text" placeholder="Buscar en inventario..." className="bg-gray-100 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 w-48" />
            <span className="absolute right-3 top-2 text-gray-400"><svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="9" cy="9" r="7" strokeWidth="2"/><path d="M15 15L19 19" strokeWidth="2"/></svg></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Administrador</span>
            <BarChart3 className="text-gray-400 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Alertas de Stock */}
      {/* Estadísticas de inventario */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-8 mt-8">
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-white w-6 h-6" />
            <span className="text-base font-semibold">Total productos</span>
          </div>
          <div className="text-3xl font-extrabold mb-1">{productos.length}</div>
          <div className="text-xs text-gray-300">Registrados</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-red-200 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-red-600 w-5 h-5" />
            <span className="text-base font-semibold text-red-700">Stock crítico</span>
          </div>
          <div className="text-2xl font-extrabold text-red-600 mb-1">{alertas.length}</div>
          <div className="text-xs text-gray-500">Productos en alerta</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600 w-5 h-5" />
            <span className="text-base font-semibold text-gray-700">Movimientos hoy</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{movimientos.filter(m => new Date(m.fecha).toDateString() === new Date().toDateString()).length}</div>
          <div className="text-xs text-gray-500">Registrados hoy</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-blue-600 w-5 h-5" />
            <span className="text-base font-semibold text-gray-700">Total movimientos</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{movimientos.length}</div>
          <div className="text-xs text-gray-500">Histórico</div>
        </div>
      </div>
      {alertas.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-8 mt-8">
          {alertas.map((producto) => (
            <div key={producto.id} className="bg-white rounded-2xl shadow p-6 border border-red-200 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-600 w-5 h-5" />
                <span className="text-base font-semibold text-red-700">Stock Crítico</span>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">{producto.nombre}</div>
              <div className="text-xs text-gray-500">Stock actual: <span className="text-red-600 font-bold">{producto.stock}</span> | Mínimo: {producto.stockMinimo}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full px-8 mt-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex items-center justify-center">
            <span className="text-gray-500 text-base">No hay productos con stock crítico actualmente.</span>
          </div>
        </div>
      )}

      {/* Formulario de Movimiento */}
      <div className="px-8 mt-8">
        <button
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => setMostrarModal(true)}
        >
          Registrar movimiento
        </button>
      </div>

      {/* Modal de registro de movimiento */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-100 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setMostrarModal(false)}>
              <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M6 6L18 18M6 18L18 6" strokeWidth="2"/></svg>
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Registrar Movimiento de Inventario</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
                  <select name="productoId" value={formData.productoId} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="0">Seleccione un producto</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>{producto.nombre} - Stock: {producto.stock}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento *</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="Ingreso">Ingreso (Compra)</option>
                    <option value="Egreso">Egreso (Venta)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                  <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} min="1" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora *</label>
                  <input type="datetime-local" name="fecha" value={formData.fecha} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
                  <input type="text" name="motivo" placeholder="Describe el motivo del movimiento" value={formData.motivo} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium">{loading ? "Registrando..." : "Registrar Movimiento"}</button>
                <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium" onClick={() => setMostrarModal(false)} disabled={loading}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Movimientos */}
      <div className="px-8 mt-8">
        <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Movimientos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Producto</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((movimiento, index) => {
                  const tipoInfo = getTipoMovimiento(movimiento.tipo);
                  return (
                    <tr key={movimiento.id} className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}>
                      <td className="px-4 py-2 text-gray-800">{new Date(movimiento.fecha).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-gray-800 font-medium">{getNombreProducto(movimiento.productoId)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${tipoInfo.color}`}>
                          {tipoInfo.icono}
                          {tipoInfo.texto}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-800 text-center font-semibold">{movimiento.tipo === "Egreso" ? "-" : "+"}{movimiento.cantidad}</td>
                      <td className="px-4 py-2 text-gray-800">{movimiento.motivo}</td>
                    </tr>
                  );
                })}
                {movimientos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 text-lg">{loading ? "Cargando..." : "No hay movimientos registrados."}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventarioPage;