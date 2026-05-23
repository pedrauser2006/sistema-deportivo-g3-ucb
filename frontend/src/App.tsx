import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Deportistas from "./pages/Deportistas";
import Reservas from "./pages/Reservas";
import Disciplinas from "./pages/Disciplinas";
import Pagos from "./pages/Pagos";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deportistas" element={<Deportistas />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/disciplinas" element={<Disciplinas />} />
          <Route path="/pagos" element={<Pagos />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: document.body.classList.contains("dark")
                ? "#1e293b"
                : "#ffffff",

              color: document.body.classList.contains("dark")
                ? "#f8fafc"
                : "#1f2937",
              padding: "14px",
            },

            success: {
              style: {
                borderLeft: "5px solid #16a34a",
              },
            },

            error: {
              style: {
                borderLeft: "5px solid #dc2626",
              },
            },
          }}
        />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
