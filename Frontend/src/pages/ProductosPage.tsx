import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ProductoDTO, ProveedorDTO } from "../types";
import { PRODUCTOS_API_URL, PROVEEDORES_API_URL } from "../config/api";
import { Package, DollarSign, AlertTriangle, CircleUser } from "lucide-react";

const ProductosPage: React.FC = () => {
  // Estilo visual recomendado: Minimalismo creativo
  // Tipografía Inter, colores pastel, sombras suaves, botones redondeados
  // Estado para búsqueda de productos
  const [busquedaProducto, setBusquedaProducto] = useState<string>("");
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [formData, setFormData] = useState<ProductoDTO>({
    codigo: "",
    nombre: "",
    descripcion: "",
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    stockMinimo: 0,
    proveedorId: undefined,
    imagenUrl: "",
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtro, setFiltro] = useState<string>("todos"); // todos, alertas, sin-stock

  useEffect(() => {
    listarProductos();
    listarProveedores();
  }, []);

  const listarProductos = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ProductoDTO[]>(PRODUCTOS_API_URL);
      setProductos(response.data || []);
    } catch (error: any) {
      console.error("Error al cargar productos:", error);
      // Si es 404, simplemente no hay datos
      if (error.response?.status === 404) {
        setProductos([]);
      } else {
        alert("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  const listarProveedores = async () => {
    try {
      const response = await axios.get<ProveedorDTO[]>(PROVEEDORES_API_URL);
      setProveedores(response.data || []);
    } catch (error: any) {
      console.error("Error al cargar proveedores:", error);
      if (error.response?.status === 404) {
        setProveedores([]);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files && files.length > 0) {
      setImagenFile(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "precioCompra" ||
          name === "precioVenta" ||
          name === "stock" ||
          name === "stockMinimo"
            ? parseFloat(value) || 0
            : name === "proveedorId"
            ? value === ""
              ? undefined
              : parseInt(value)
            : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imagenUrlFinal = formData.imagenUrl;
    try {
      // Si hay archivo de imagen, subir primero
      if (imagenFile) {
        const formDataImg = new FormData();
        formDataImg.append("file", imagenFile);
        // Cambia la URL a la de tu endpoint de subida de imágenes
        const resp = await axios.post(`${PRODUCTOS_API_URL}/upload-image`, formDataImg, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imagenUrlFinal = resp.data.url;
      }
      const productoPayload = { ...formData, imagenUrl: imagenUrlFinal };
      if (editando && idEditando) {
        await axios.put(`${PRODUCTOS_API_URL}/${idEditando}`, productoPayload);
        alert("Producto actualizado exitosamente");
      } else {
        await axios.post(PRODUCTOS_API_URL, productoPayload);
        alert("Producto creado exitosamente");
      }
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        precioCompra: 0,
        precioVenta: 0,
        stock: 0,
        stockMinimo: 0,
        proveedorId: undefined,
        imagenUrl: "",
      });
      setImagenFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setEditando(false);
      setIdEditando(null);
      setModalOpen(false); // Cierra el modal
      listarProductos();
    } catch (error: any) {
      alert(error.response?.data?.mensaje || "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto: ProductoDTO) => {
  setFormData(producto);
  setEditando(true);
  setIdEditando(producto.id || null);
  setModalOpen(true);
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    setLoading(true);
    try {
      await axios.delete(`${PRODUCTOS_API_URL}/${id}`);
      alert("Producto eliminado exitosamente");
      listarProductos();
    } catch (error) {
      alert("Error al eliminar el producto");
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditando(null);
    setFormData({
      codigo: "",
      nombre: "",
      descripcion: "",
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      stockMinimo: 0,
      proveedorId: undefined,
      imagenUrl: "",
    });
    setImagenFile(null);
  };

  const getProductosFiltrados = (): ProductoDTO[] => {
    let filtrados: ProductoDTO[] = productos;
    if (busquedaProducto.trim() !== "") {
      const query = busquedaProducto.trim().toLowerCase();
      filtrados = filtrados.filter(
        (p: ProductoDTO) =>
          p.nombre.toLowerCase().includes(query) ||
          p.descripcion.toLowerCase().includes(query)
      );
    }
    switch (filtro) {
      case "completo":
        return filtrados.filter((p: ProductoDTO) => p.stock > p.stockMinimo);
      case "bajo":
        return filtrados.filter((p: ProductoDTO) => p.stock <= p.stockMinimo && p.stock > 0);
      case "agotado":
        return filtrados.filter((p: ProductoDTO) => p.stock === 0);
      default:
        return filtrados;
    }
  };

  const productosFiltrados = getProductosFiltrados();

  return (
    <div className="max-w-full w-full min-h-screen bg-[#F6F6F6] font-inter pb-16">
      {/* Header blanco con barra de búsqueda y usuario */}
      <div className="w-full bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Productos</h1>
          <p className="text-gray-500 text-sm">Aquí están las métricas de productos hoy</p>
        </div>
        <div className="flex items-center gap-6">
          
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Administrador</span>
              <CircleUser className="text-gray-400" size={32} />
          </div>
        </div>
      </div>
  {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.18)] p-8 w-full max-w-lg border border-[#E3E6F3] relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#F25C5C] text-2xl font-bold"
              onClick={() => { setModalOpen(false); cancelarEdicion(); }}
              aria-label="Cerrar"
            >×</button>
            <h3 className="text-2xl font-bold text-[#3A6B8A] mb-6 font-inter">{editando ? "Editar Producto" : "Nuevo Producto"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Código</label>
                <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter" />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Precio compra</label>
                  <input type="number" name="precioCompra" value={formData.precioCompra} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter" required />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Precio venta</label>
                  <input type="number" name="precioVenta" value={formData.precioVenta} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter" required />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter" required />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Stock mínimo</label>
                  <input type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Proveedor</label>
                <select name="proveedorId" value={formData.proveedorId ?? ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter">
                  <option value="">Sin proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3A6B8A] mb-1">Imagen actual</label>
                {formData.imagenUrl ? (
                  <img src={formData.imagenUrl} alt="Imagen actual" className="h-20 object-contain rounded-xl mb-2 border border-[#E3E6F3]" />
                ) : (
                  <span className="text-gray-400 text-sm">Sin imagen</span>
                )}
                <input type="file" name="imagen" ref={fileInputRef} onChange={handleChange} accept="image/*" className="w-full border border-gray-300 rounded-xl px-4 py-3 font-inter mt-2" />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="bg-[#3A6B8A] hover:bg-[#29506A] text-white px-6 py-3 rounded-xl font-semibold shadow font-inter flex-1">{editando ? "Guardar cambios" : "Crear producto"}</button>
                <button type="button" className="bg-[#E3B505] hover:bg-[#C9A004] text-white px-6 py-3 rounded-xl font-semibold shadow font-inter flex-1" onClick={() => { setModalOpen(false); cancelarEdicion(); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 pt-8">
          {/* Tarjeta principal oscura */}
          <div className="bg-gray-900 rounded-2xl shadow-lg flex flex-col justify-between p-8 text-white relative">
            <div className="flex items-center gap-4 mb-4">
              <Package className="text-white" size={36} />
              <span className="text-lg font-semibold">Total Productos</span>
            </div>
            <div className="text-4xl font-extrabold mb-2">{productos.length}</div>
            <div className="flex gap-6 text-sm opacity-80">
              <span>{productos.length > 1 ? `${productos.length} productos` : `${productos.length} producto`}</span>
              <span>Inventario: Bs {productos.reduce((acc, p) => acc + p.precioVenta * p.stock, 0).toFixed(2)}</span>
            </div>
          </div>
          {/* Tarjeta stock bajo */}
          <div className="bg-white rounded-2xl shadow flex flex-col justify-between p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle className="text-[#E3B505]" size={36} />
              <span className="text-lg font-semibold text-gray-700">Bajo Stock</span>
            </div>
            <div className="text-3xl font-extrabold text-[#E3B505] mb-2">{productos.filter(p => p.stock <= p.stockMinimo && p.stock > 0).length}</div>
            <div className="text-sm text-gray-500">Productos con alerta</div>
          </div>
          {/* Tarjeta agotados */}
          <div className="bg-white rounded-2xl shadow flex flex-col justify-between p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Package className="text-[#F25C5C]" size={36} />
              <span className="text-lg font-semibold text-gray-700">Agotados</span>
            </div>
            <div className="text-3xl font-extrabold text-[#F25C5C] mb-2">{productos.filter(p => p.stock === 0).length}</div>
            <div className="text-sm text-gray-500">Sin stock</div>
          </div>
          {/* Tarjeta valor inventario */}
          <div className="bg-white rounded-2xl shadow flex flex-col justify-between p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <DollarSign className="text-[#2DBE60]" size={36} />
              <span className="text-lg font-semibold text-gray-700">Valor Inventario</span>
            </div>
            <div className="text-3xl font-extrabold text-[#2DBE60] mb-2">Bs {productos.reduce((acc, p) => acc + p.precioVenta * p.stock, 0).toFixed(2)}</div>
            <div className="text-sm text-gray-500">Total en almacén</div>
          </div>
        </div>
      
      {/* Barra de búsqueda y filtros */}
      <div className="mb-8 flex flex-col gap-4 px-8">
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow font-inter transition flex items-center gap-2"
            onClick={() => {
              setEditando(false);
              setIdEditando(null);
              setFormData({
                codigo: "",
                nombre: "",
                descripcion: "",
                precioCompra: 0,
                precioVenta: 0,
                stock: 0,
                stockMinimo: 0,
                proveedorId: undefined,
                imagenUrl: "",
              });
              setImagenFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              setModalOpen(true);
            }}
          >
            <span className="font-bold text-lg">＋</span> Registrar nuevo producto
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow flex flex-col md:flex-row items-center gap-4 px-6 py-5 border border-gray-200">
          <input
            type="text"
            placeholder="Buscar productos por nombre o descripción..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-inter bg-gray-50"
            value={busquedaProducto}
            onChange={e => setBusquedaProducto(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-inter bg-gray-50"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="completo">Stock completo</option>
            <option value="bajo">Bajo stock</option>
            <option value="agotado">Agotados</option>
          </select>
          <button
            className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow hover:bg-gray-700 transition font-semibold text-lg font-inter"
            onClick={() => { setBusquedaProducto(""); setFiltro("todos"); }}
          >Limpiar filtros</button>
        </div>
      </div>
      {/* Catálogo de productos */}
      <div className="bg-white rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.08)] p-8 border border-[#F0F1F6] mt-4 mx-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 font-inter">Productos ({productosFiltrados.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productosFiltrados.map((producto: ProductoDTO) => (
            <div key={producto.id} className="rounded-2xl shadow border border-gray-200 bg-white flex flex-col p-6 relative font-inter hover:scale-[1.02] transition">
              {/* Estado badge */}
              {producto.stock === 0 ? (
                <span className="absolute top-6 left-6 bg-[#F25C5C] text-white px-4 py-1 rounded-full font-semibold text-sm">Agotado</span>
              ) : producto.stock <= producto.stockMinimo ? (
                <span className="absolute top-6 left-6 bg-[#E3B505] text-white px-4 py-1 rounded-full font-semibold text-sm">Bajo Stock</span>
              ) : null}
              {/* Imagen */}
              <div className="flex justify-center items-center mb-4 h-32">
                {producto.imagenUrl ? (
                  <img src={producto.imagenUrl} alt={producto.nombre} className="h-28 object-contain rounded-xl" />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-xl">
                    <Package className="text-gray-400" size={40} strokeWidth={2} />
                  </div>
                )}
              </div>
              {/* Nombre y descripción */}
              <div className="mb-2">
                <div className="text-lg font-bold text-gray-900">{producto.nombre}</div>
                <div className="text-sm text-gray-500">{producto.descripcion}</div>
              </div>
              {/* Precio y stock */}
              <div className="mt-auto">
                <div className="text-lg font-bold text-gray-900 mb-1">Bs {producto.precioVenta.toFixed(2)}</div>
                {producto.stock > 0 && (
                  <div className="text-sm text-gray-700">Stock: <span className="font-semibold">{producto.stock} unidades</span></div>
                )}
              </div>
              {/* Acciones */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => { handleEdit(producto); setModalOpen(true); }}
                  className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition font-inter"
                >Editar</button>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-xl font-semibold shadow transition font-inter"
                >Eliminar</button>
              </div>
            </div>
          ))}
          {productosFiltrados.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 text-lg font-inter">
              {loading ? "Cargando..." : "No hay productos con este filtro."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductosPage;
