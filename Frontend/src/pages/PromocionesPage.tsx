import React, { useEffect, useState } from "react";
import axios from "axios";
import { PromocionDTO, ProductoDTO } from "../types";
import { PROMOCIONES_API_URL, PRODUCTOS_API_URL } from "../config/api";
import { Tag, Calendar, CheckCircle, XCircle } from "lucide-react";

const PromocionesPage: React.FC = () => {
  const [mostrarFormModal, setMostrarFormModal] = useState<boolean>(false);
  const [promociones, setPromociones] = useState<PromocionDTO[]>([]);
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [formData, setFormData] = useState<PromocionDTO>({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    activa: true,
  });
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState<number | null>(null);
  const [productosPromocion, setProductosPromocion] = useState<{ productoId: number; descuento: number }[]>([]);
  // Mostrar productos asignados a la promoción seleccionada en el modal
  const [productosAsignados, setProductosAsignados] = useState<any[]>([]);

  useEffect(() => {
    listarPromociones();
    listarProductos();
  }, []);

  const listarPromociones = async () => {
    setLoading(true);
    try {
      const response = await axios.get<PromocionDTO[]>(PROMOCIONES_API_URL);
      setPromociones(response.data || []);
    } catch (error: any) {
      console.error("Error al cargar promociones:", error);
      // Si es 404, simplemente no hay datos
      if (error.response?.status === 404) {
        setPromociones([]);
      } else {
        alert("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editando && idEditando) {
        await axios.put(`${PROMOCIONES_API_URL}/${idEditando}`, formData);
        alert("Promoción actualizada exitosamente");
      } else {
        await axios.post(PROMOCIONES_API_URL, formData);
        alert("Promoción creada exitosamente");
      }

      setFormData({
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        activa: true,
      });
      setEditando(false);
      setIdEditando(null);
      listarPromociones();
    } catch (error: any) {
      alert(error.response?.data?.mensaje || "Error al guardar la promoción");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promocion: PromocionDTO) => {
    setFormData({
      ...promocion,
      fechaInicio: promocion.fechaInicio.split("T")[0],
      fechaFin: promocion.fechaFin.split("T")[0],
    });
    setEditando(true);
    setIdEditando(promocion.id || null);
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm("¿Seguro que deseas eliminar esta promoción?")) return;

    setLoading(true);
    try {
      await axios.delete(`${PROMOCIONES_API_URL}/${id}`);
      alert("Promoción eliminada exitosamente");
      listarPromociones();
    } catch (error) {
      alert("Error al eliminar la promoción");
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditando(null);
    setFormData({
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      activa: true,
    });
  };

  const abrirModalProductos = async (id: number) => {
    setPromocionSeleccionada(id);
    setMostrarModal(true);
    setProductosPromocion([]);
    // Obtener productos ya asignados a la promoción
    try {
      const resp = await axios.get(`/api/promociones/${id}`);
      setProductosAsignados(resp.data.productos || []);
    } catch {
      setProductosAsignados([]);
    }
  };

  const agregarProductoPromocion = () => {
    setProductosPromocion([...productosPromocion, { productoId: 0, descuento: 0 }]);
  };

  const actualizarProductoPromocion = (index: number, campo: string, valor: any) => {
    const nuevosProductos = [...productosPromocion];
    nuevosProductos[index] = {
      ...nuevosProductos[index],
      [campo]: campo === "productoId" ? parseInt(valor) : parseFloat(valor),
    };
    setProductosPromocion(nuevosProductos);
  };

  const eliminarProductoPromocion = (index: number) => {
    const nuevosProductos = productosPromocion.filter((_, i) => i !== index);
    setProductosPromocion(nuevosProductos);
  };

  const guardarProductosPromocion = async () => {
    if (!promocionSeleccionada) return;
    // Validar productos
    const productosValidos = productosPromocion.filter(
      item => item.productoId > 0 && item.descuento > 0 && item.descuento <= 100
    );
    if (productosValidos.length === 0) {
      alert("Debes asignar al menos un producto válido y descuento mayor a 0.");
      return;
    }
    // Validar duplicados
    const ids = productosValidos.map(p => p.productoId);
    if (new Set(ids).size !== ids.length) {
      alert("No puedes asignar el mismo producto dos veces.");
      return;
    }
    // Construir el array con la estructura esperada por el backend
    const payload = productosValidos.map(item => ({
      productoId: item.productoId,
      producto: productos.find(p => p.id === item.productoId),
      descuentoPorcentaje: item.descuento
    }));
    try {
      await axios.post(`/api/promociones/${promocionSeleccionada}/productos`, payload);
      alert("Productos asignados exitosamente");
      setMostrarModal(false);
      setProductosPromocion([]);
    } catch (error) {
      alert("Error al asignar productos a la promoción");
    }
  };

  // Mostrar productos asignados y aplicar precio promocional
  const calcularPrecioPromocional = (producto: ProductoDTO, descuentoPorcentaje: number): string => {
    if (!producto || !descuentoPorcentaje || descuentoPorcentaje <= 0) return producto?.precioVenta?.toFixed(2) || "0.00";
    return (producto.precioVenta * (1 - descuentoPorcentaje / 100)).toFixed(2);
  };

  return (
    <div className="max-w-full w-full min-h-screen bg-[#F6F6F6] font-inter pb-16">
      {/* Header blanco con barra de búsqueda y usuario */}
      <div className="w-full bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Tag className="text-blue-600 w-6 h-6" />
            Promociones
          </h1>
          <p className="text-gray-500 text-sm">Gestión de promociones y descuentos</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input type="text" placeholder="Buscar promoción..." className="bg-gray-100 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 w-48" />
            <span className="absolute right-3 top-2 text-gray-400"><svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="9" cy="9" r="7" strokeWidth="2"/><path d="M15 15L19 19" strokeWidth="2"/></svg></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Administrador</span>
            <Tag className="text-gray-400 w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-8 mt-8">
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="text-white w-6 h-6" />
            <span className="text-base font-semibold">Total promociones</span>
          </div>
          <div className="text-3xl font-extrabold mb-1">{promociones.length}</div>
          <div className="text-xs text-gray-300">Registradas</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-green-200 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600 w-5 h-5" />
            <span className="text-base font-semibold text-green-700">Activas</span>
          </div>
          <div className="text-2xl font-extrabold text-green-600 mb-1">{promociones.filter(p => p.activa).length}</div>
          <div className="text-xs text-gray-500">Promociones activas</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-red-200 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="text-red-600 w-5 h-5" />
            <span className="text-base font-semibold text-red-700">Inactivas</span>
          </div>
          <div className="text-2xl font-extrabold text-red-600 mb-1">{promociones.filter(p => !p.activa).length}</div>
          <div className="text-xs text-gray-500">Promociones inactivas</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600 w-5 h-5" />
            <span className="text-base font-semibold text-gray-700">Vigentes hoy</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{promociones.filter(p => new Date(p.fechaInicio) <= new Date() && new Date(p.fechaFin) >= new Date()).length}</div>
          <div className="text-xs text-gray-500">En curso</div>
        </div>
      </div>
      <div className="px-8 mt-8">
        <button
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => { setEditando(false); setFormData({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', activa: true }); setMostrarFormModal(true); }}
        >
          Registrar nueva promoción
        </button>
      </div>
      

      {/* Formulario */}
      {/* Modal de registro/edición */}
      {mostrarFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-100 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setMostrarFormModal(false)}>
              <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M6 6L18 18M6 18L18 6" strokeWidth="2"/></svg>
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{editando ? "Editar Promoción" : "Nueva Promoción"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><Tag size={16} className="inline mr-1" />Nombre *</label>
                  <input type="text" name="nombre" placeholder="Nombre de la promoción" value={formData.nombre} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" name="activa" checked={formData.activa} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                    <span className="ml-2 text-sm font-medium text-gray-700">Promoción Activa</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea name="descripcion" placeholder="Descripción de la promoción" value={formData.descripcion} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><Calendar size={16} className="inline mr-1" />Fecha Inicio *</label>
                  <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><Calendar size={16} className="inline mr-1" />Fecha Fin *</label>
                  <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium">{loading ? "Guardando..." : editando ? "Actualizar" : "Guardar"}</button>
                <button type="button" onClick={() => { setMostrarFormModal(false); cancelarEdicion(); }} className="bg-gray-400 text-white px-6 py-2.5 rounded-lg hover:bg-gray-500 transition font-medium">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="px-8 mt-8">
        <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Listado de Promociones</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Fecha Inicio</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Fecha Fin</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {promociones.map((promocion, index) => (
                  <tr key={promocion.id} className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}>
                    <td className="px-4 py-2 text-gray-800 font-medium">{promocion.nombre}</td>
                    <td className="px-4 py-2 text-gray-800">{promocion.descripcion}</td>
                    <td className="px-4 py-2 text-gray-800">{new Date(promocion.fechaInicio).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-gray-800">{new Date(promocion.fechaFin).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-center">
                      {promocion.activa ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"><CheckCircle size={16} /> Activa</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold"><XCircle size={16} /> Inactiva</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button onClick={() => abrirModalProductos(promocion.id!)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition font-medium text-sm">Asignar Productos</button>
                        <button onClick={() => { handleEdit(promocion); setMostrarFormModal(true); }} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition font-medium">Editar</button>
                        <button onClick={() => handleDelete(promocion.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {promociones.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 text-lg">{loading ? "Cargando..." : "No hay promociones registradas."}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para asignar productos */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Asignar Productos a Promoción</h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-white hover:bg-purple-800 rounded-lg p-2 transition"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              <button
                onClick={agregarProductoPromocion}
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium"
              >
                + Agregar Producto
              </button>

              {/* Mostrar productos ya asignados */}
              {productosAsignados.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Productos asignados:</h4>
                  <ul className="list-disc ml-6">
                    {productosAsignados.map((item, idx) => (
                      <li key={idx} className="text-gray-600">
                        {item.producto?.nombre} ({item.producto?.codigo}) -
                        <span className="ml-2">Descuento: {item.descuentoPorcentaje}%</span>
                        <span className="ml-2 font-bold text-green-700">Precio promocional: Bs {calcularPrecioPromocional(item.producto, item.descuentoPorcentaje)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formulario para agregar nuevos productos */}
              {productosPromocion.map((item, index) => (
                <div key={index} className="flex gap-3 mb-3 items-center">
                  <select
                    value={item.productoId}
                    onChange={(e) =>
                      actualizarProductoPromocion(index, "productoId", e.target.value)
                    }
                    className="flex-1 border border-gray-300 p-2 rounded-lg"
                  >
                    <option value="0">Seleccione un producto</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre} - {producto.codigo}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="% Descuento"
                    value={item.descuento}
                    onChange={(e) =>
                      actualizarProductoPromocion(index, "descuento", e.target.value)
                    }
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-32 border border-gray-300 p-2 rounded-lg"
                  />
                  <button
                    onClick={() => eliminarProductoPromocion(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ))}

              {productosPromocion.length === 0 && productosAsignados.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay productos asignados. Haz clic en "Agregar Producto" para comenzar.
                </p>
              )}
            </div>
            <div className="border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-400 text-white px-6 py-2.5 rounded-lg hover:bg-gray-500 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={guardarProductosPromocion}
                className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromocionesPage;
