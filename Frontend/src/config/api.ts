const USE_PROXY = false;
const BACKEND_URL = "https://localhost:7224";

export const API_BASE_URL = USE_PROXY ? "/api" : `${BACKEND_URL}/api`;
export const CLIENTES_API_URL = USE_PROXY ? "/api/Clientes" : `${BACKEND_URL}/api/Clientes`;
export const PROVEEDORES_API_URL = USE_PROXY ? "/api/Proveedores" : `${BACKEND_URL}/api/Proveedores`;
export const PRODUCTOS_API_URL = USE_PROXY ? "/api/Productos" : `${BACKEND_URL}/api/Productos`;
export const PROMOCIONES_API_URL = USE_PROXY ? "/api/Promociones" : `${BACKEND_URL}/api/Promociones`;
export const DEVOLUCIONES_API_URL = USE_PROXY ? "/api/Devoluciones" : `${BACKEND_URL}/api/Devoluciones`;
export const INVENTARIO_API_URL = USE_PROXY ? "/api/Inventario" : `${BACKEND_URL}/api/Inventario`;
