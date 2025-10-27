import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ClientesPage from "./pages/ClientesPage.tsx";
import ProveedoresPage from "./pages/ProveedoresPage.tsx";
import ProductosPage from "./pages/ProductosPage.tsx";
import PromocionesPage from "./pages/PromocionesPage.tsx";
import DevolucionesPage from "./pages/DevolucionesPage.tsx";
import InventarioPage from "./pages/InventarioPage.tsx";
import POSPage from "./pages/POSPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/promociones" element={<PromocionesPage />} />
          <Route path="/devoluciones" element={<DevolucionesPage />} />
          <Route path="/inventario" element={<InventarioPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
