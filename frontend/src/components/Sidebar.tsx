import { Link, useLocation } from "react-router-dom";
import logoUCB from "../assets/logo-UCB.png";

import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaFutbol,
  FaMoneyBillWave,
} from "react-icons/fa";

import "../styles/sidebar.css";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: Props) {
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      label: "Inicio",
      icon: <FaHome />,
    },
    {
      path: "/reservas",
      label: "Reservas",
      icon: <FaCalendarAlt />,
    },
    {
      path: "/deportistas",
      label: "Deportistas",
      icon: <FaUsers />,
    },
    {
      path: "/disciplinas",
      label: "Disciplinas",
      icon: <FaFutbol />,
    },
    {
      path: "/pagos",
      label: "Pagos",
      icon: <FaMoneyBillWave />,
    },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logoUCB} alt="UCB" />
        </div>

        <div>
          <h2>Gestión Deportiva</h2>
          <p>Universidad Católica</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>

            <span className="link-text">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">A</div>

        <div>
          <strong>Administrador</strong>
          <p>Sistema Deportivo</p>
        </div>
      </div>
    </aside>
  );
}
