import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProveedorDTO, ProductoDTO } from "../types";
import { PROVEEDORES_API_URL, PRODUCTOS_API_URL } from "../config/api";
import { Truck, Mail, Phone, MapPin, FileText, Package } from "lucide-react";

const ProveedoresPage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [productosProveedor, setProductosProveedor] = useState<ProductoDTO[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProveedorDTO>({
    nombre: "",
    ruc: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    listarProveedores();
  }, []);

  const listarProveedores = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ProveedorDTO[]>(PROVEEDORES_API_URL);
      setProveedores(response.data || []);
    } catch (error: any) {
      console.error("Error al cargar proveedores:", error);
      // Si es 404, simplemente no hay datos
      if (error.response?.status === 404) {
        setProveedores([]);
      } else {
        alert("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  const verProductosProveedor = async (id: number) => {
    try {
      const response = await axios.get<ProductoDTO[]>(`${PROVEEDORES_API_URL}/${id}/details`);
      setProductosProveedor(response.data);
      setProveedorSeleccionado(id);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      // Si el endpoint no existe, buscar productos por proveedorId
      try {
        const response = await axios.get<ProductoDTO[]>(PRODUCTOS_API_URL);
        const productosFiltrados = response.data.filter(p => p.proveedorId === id);
        setProductosProveedor(productosFiltrados);
        setProveedorSeleccionado(id);
      } catch (error2) {
        alert("Error al cargar los productos del proveedor");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editando && idEditando) {
        await axios.put(`${PROVEEDORES_API_URL}/${idEditando}`, formData);
        alert("Proveedor actualizado exitosamente");
      } else {
        await axios.post(PROVEEDORES_API_URL, formData);
        alert("Proveedor creado exitosamente");
      }

      setFormData({
        nombre: "",
        ruc: "",
        telefono: "",
        email: "",
        direccion: "",
      });
      setEditando(false);
      setIdEditando(null);
      listarProveedores();
    } catch (error: any) {
      alert(error.response?.data?.mensaje || "Error al guardar el proveedor");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (proveedor: ProveedorDTO) => {
    setFormData(proveedor);
    setEditando(true);
    setIdEditando(proveedor.id || null);
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return;

    setLoading(true);
    try {
      await axios.delete(`${PROVEEDORES_API_URL}/${id}`);
      alert("Proveedor eliminado exitosamente");
      listarProveedores();
    } catch (error) {
      alert("Error al eliminar el proveedor");
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditando(null);
    setFormData({
      nombre: "",
      ruc: "",
      telefono: "",
      email: "",
      direccion: "",
    });
  };

  return (
    <div className="max-w-full w-full min-h-screen bg-[#F6F6F6] font-inter pb-16">
      {/* Header blanco con barra de búsqueda y usuario */}
      <div className="w-full bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Truck className="text-blue-600 w-6 h-6" />
            Proveedores
          </h1>
          <p className="text-gray-500 text-sm">Gestión de proveedores registrados</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input type="text" placeholder="Buscar proveedor..." className="bg-gray-100 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 w-48" value={search} onChange={e => setSearch(e.target.value)} />
            <span className="absolute right-3 top-2 text-gray-400"><svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="9" cy="9" r="7" strokeWidth="2"/><path d="M15 15L19 19" strokeWidth="2"/></svg></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Administrador</span>
            <Truck className="text-gray-400 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mt-8">
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="text-white w-6 h-6" />
            <span className="text-base font-semibold">Total</span>
          </div>
          <div className="text-3xl font-extrabold mb-1">{proveedores.length}</div>
          <div className="text-xs text-gray-300">Registrados</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-semibold text-gray-700">Con Email</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{proveedores.filter(p => p.email).length}</div>
          <div className="text-xs text-gray-500">Email registrado</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-semibold text-gray-700">Con Teléfono</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{proveedores.filter(p => p.telefono).length}</div>
          <div className="text-xs text-gray-500">Teléfono registrado</div>
        </div>
      </div>

      {/* Botón para abrir modal de registro */}
      <div className="px-8 mt-8">
        <button
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => { setEditando(false); setFormData({ nombre: '', ruc: '', telefono: '', email: '', direccion: '' }); setMostrarModal(true); }}
        >
          Registrar nuevo proveedor
        </button>
      </div>

      {/* Modal de registro/edición */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-100 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setMostrarModal(false)}>
              <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M6 6L18 18M6 18L18 6" strokeWidth="2"/></svg>
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{editando ? "Editar Proveedor" : "Nuevo Proveedor"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
                  <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition" disabled={loading}>{editando ? "Actualizar" : "Registrar"}</button>
                <button type="button" className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-300 transition" onClick={() => { setMostrarModal(false); cancelarEdicion(); }} disabled={loading}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de proveedores */}
      <div className="px-8 mt-8">
        <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Listado de Proveedores</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">RUC</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Teléfono</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Dirección</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.filter(p => {
                  const term = search.toLowerCase();
                  return (
                    (p.nombre ?? "").toLowerCase().includes(term) ||
                    (p.ruc ?? "").toLowerCase().includes(term) ||
                    (p.telefono ?? "").toLowerCase().includes(term) ||
                    (p.email ?? "").toLowerCase().includes(term) ||
                    (p.direccion ?? "").toLowerCase().includes(term)
                  );
                }).map((proveedor, index) => (
                  <tr key={proveedor.id} className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}>
                    <td className="px-4 py-2 text-gray-800">{proveedor.nombre}</td>
                    <td className="px-4 py-2 text-gray-800">{proveedor.ruc}</td>
                    <td className="px-4 py-2 text-gray-800">{proveedor.telefono}</td>
                    <td className="px-4 py-2 text-gray-800">{proveedor.email}</td>
                    <td className="px-4 py-2 text-gray-800">{proveedor.direccion}</td>
                    <td className="px-4 py-2 flex gap-2 justify-center">
                      <button className="bg-gray-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-50 transition" onClick={() => verProductosProveedor(proveedor.id!)} disabled={loading}>Ver Productos</button>
                      <button className="bg-gray-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition" onClick={() => { handleEdit(proveedor); setMostrarModal(true); }} disabled={loading}>Editar</button>
                      <button className="bg-gray-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition" onClick={() => handleDelete(proveedor.id)} disabled={loading}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {proveedores.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 text-lg">
                      {loading ? "Cargando..." : "No hay proveedores registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Productos */}
      {proveedorSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-2xl font-bold">Productos del Proveedor</h3>
              <button onClick={() => { setProveedorSeleccionado(null); setProductosProveedor([]); }} className="text-white hover:bg-gray-800 rounded-lg p-2 transition">
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              {productosProveedor.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Código</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Precio Compra</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Precio Venta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productosProveedor.map((producto) => (
                      <tr key={producto.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{producto.codigo}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{producto.nombre}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{producto.stock}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">Bs {producto.precioCompra.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">Bs {producto.precioVenta.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-8">Este proveedor no tiene productos asignados</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProveedoresPage;
