import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaCalendarCheck,
  FaFutbol,
  FaMoneyBillWave,
  FaUserPlus,
} from "react-icons/fa";

import "../styles/home.css";
import { getDeportistas } from "../services/deportistas.service";
import { getReservas } from "../services/reservas.service";
import { getDisciplinas } from "../services/disciplinas.service";
import { getPagos } from "../services/pagos.service";

export default function Home() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    deportistas: 0,
    reservas: 0,
    disciplinas: 0,
    pagos: 0,
  });
  const [actividadReciente, setActividadReciente] = useState<string[]>([]);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const [deportistas, reservas, disciplinas, pagos] = await Promise.all([
          getDeportistas(),
          getReservas(),
          getDisciplinas(),
          getPagos(),
        ]);

        setStatsData({
          deportistas: deportistas.length,
          reservas: reservas.length,
          disciplinas: disciplinas.length,
          pagos: pagos.length,
        });

        const actividades = [
          ...reservas
            .slice(-1)
            .map((r: any) => `Reserva registrada para espacio ${r.espacio_id}`),

          ...deportistas
            .slice(-1)
            .map((d: any) => `Deportista ${d.nombre_completo} registrado`),

          ...pagos
            .slice(-1)
            .map((p: any) => `Pago de Bs. ${p.monto} confirmado`),

          ...disciplinas
            .slice(-1)
            .map((d: any) => `Disciplina ${d.nombre} agregada`),
        ];

        setActividadReciente(actividades);
      } catch (error) {
        console.error(error);
      }
    };

    cargarDashboard();
  }, []);

  const stats = [
    {
      title: "Deportistas",
      value: statsData.deportistas,
      icon: <FaUsers />,
      route: "/deportistas",
    },
    {
      title: "Reservas",
      value: statsData.reservas,
      icon: <FaCalendarCheck />,
      route: "/reservas",
    },
    {
      title: "Disciplinas",
      value: statsData.disciplinas,
      icon: <FaFutbol />,
      route: "/disciplinas",
    },
    {
      title: "Pagos",
      value: statsData.pagos,
      icon: <FaMoneyBillWave />,
      route: "/pagos",
    },
  ];

  return (
    <div>
      <div className="welcome-banner">
        <div>
          <h2>Bienvenido al sistema deportivo</h2>

          <p>Administra reservas, deportistas y pagos de forma eficiente.</p>
        </div>

        <button className="btn-primary">Ver Reportes</button>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div
            className="stat-card"
            key={stat.title}
            onClick={() => navigate(stat.route)}
          >
            <div>
              <p>{stat.title}</p>

              <h3>{stat.value}</h3>
            </div>

            <div className="stat-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-section">
        <h2 className="section-title">Accesos rápidos</h2>

        <div className="quick-grid">
          <div
            className="quick-card"
            onClick={() => navigate("/reservas?modal=crear")}
          >
            <div className="quick-icon">
              <FaCalendarCheck />
            </div>

            <span>Nueva Reserva</span>
          </div>

          <div
            className="quick-card"
            onClick={() => navigate("/deportistas?modal=crear")}
          >
            <div className="quick-icon">
              <FaUserPlus />
            </div>

            <span>Registrar Deportista</span>
          </div>

          <div
            className="quick-card"
            onClick={() => navigate("/disciplinas?modal=crear")}
          >
            <div className="quick-icon">
              <FaFutbol />
            </div>

            <span>Nueva Disciplina</span>
          </div>

          <div
            className="quick-card"
            onClick={() => navigate("/pagos?modal=crear")}
          >
            <div className="quick-icon">
              <FaMoneyBillWave />
            </div>

            <span>Registrar Pago</span>
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="dashboard-section">
        <h2 className="section-title">Actividad reciente</h2>

        <div className="activity-card">
          {actividadReciente.map((actividad, index) => (
            <div className="activity-item" key={index}>
              {actividad}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
