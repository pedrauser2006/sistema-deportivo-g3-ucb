import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { FaBell, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";

import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/reservas": "Gestión de Reservas",
    "/deportistas": "Gestión de Deportistas",
    "/disciplinas": "Gestión de Disciplinas",
    "/pagos": "Gestión de Pagos",
  };

  const currentTitle = titles[location.pathname] || "Sistema";

  const today = new Date();

  const formattedDate = today.toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="navbar">
      <div>
        <h1 className="navbar-title">{currentTitle}</h1>

        <p className="navbar-subtitle">Universidad Católica Boliviana</p>
      </div>

      <div className="navbar-right">
        <div className="navbar-date">{formattedDate}</div>

        <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="notification-btn">
          <FaBell />
        </button>

        <div className="navbar-user">
          <FaUserCircle />

          <div>
            <strong>Administrador</strong>
            <p>UCB Deportes</p>
          </div>
        </div>
      </div>
    </header>
  );
}
