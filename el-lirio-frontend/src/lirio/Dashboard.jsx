import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiDownload,
  FiPlus,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import useApi from "./useApi";
import { useStore } from "./StoreContext";
import { useTheme } from "./theme";
import { money, date, api, exportCsv, imageUrl } from "./api";
import { PageHeading, Loading, ErrorBox, Empty, Status } from "./UI";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
  Legend,
);

export function Stats({ data: d }) {
  return (
    <div className="stats-grid">
      {[
        [
          "Ventas aprobadas",
          money(d.ventas),
          FiDollarSign,
          "Durante el período seleccionado",
          "green",
        ],
        [
          "Valor de inventario",
          money(d.valorInventario),
          FiPackage,
          d.productos + " productos activos",
          "peach",
        ],
        [
          "Pedidos por validar",
          String(d.pedidosPendientes).padStart(2, "0"),
          FiShoppingBag,
          "En espera de tu confirmación",
          "lavender",
        ],
        [
          "Clientes registrados",
          String(d.clientes).padStart(2, "0"),
          FiUsers,
          "Personas que eligen tu tienda",
          "sand",
        ],
      ].map(([label, value, Icon, note, color], i) => (
        <article
          key={label}
          className={"stat-card glass " + (i === 0 ? "stat-primary" : "")}
        >
          <div className="stat-card-top">
            <span className={"stat-icon " + color}>
              <Icon />
            </span>
            <FiArrowUpRight />
          </div>
          <span className="stat-label">{label}</span>
          <strong>{value}</strong>
          <small>
            <i />
            {note}
          </small>
        </article>
      ))}
    </div>
  );
}
export function SalesChart({ data: d }) {
  const { theme } = useTheme();
  const lineColor = theme === "dark" ? "#ff8a97" : "#c71e2d";
  const tickColor = theme === "dark" ? "#c4afb7" : "#75636b";
  const labels = d.grafico.map((p) =>
    new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(
      new Date(p.fecha + "T12:00:00"),
    ),
  );
  return (
    <div className="line-chart">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Ventas aprobadas",
              data: d.grafico.map((p) => Number(p.total)),
              borderColor: lineColor,
              borderWidth: 2.5,
              pointRadius: d.grafico.length > 30 ? 0 : 3,
              pointBackgroundColor: lineColor,
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              tension: 0.4,
              fill: true,
              backgroundColor: (context) => {
                const chart = context.chart;
                if (!chart.chartArea) return "rgba(199,30,45,.1)";
                const gradient = chart.ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  chart.height,
                );
                gradient.addColorStop(0, "rgba(199,30,45,.24)");
                gradient.addColorStop(1, "rgba(199,30,45,0)");
                return gradient;
              },
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#571923",
              padding: 12,
              displayColors: false,
              callbacks: { label: (c) => money(c.parsed.y) },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { color: tickColor, font: { size: 10 }, maxTicksLimit: 7 },
            },
            y: {
              beginAtZero: true,
              border: { display: false },
              grid: { color: theme === "dark" ? "#4e3842" : "#f0e5e8" },
              ticks: {
                color: tickColor,
                font: { size: 10 },
                maxTicksLimit: 5,
                callback: (v) => "S/ " + v,
              },
            },
          },
        }}
      />
    </div>
  );
}
export function CategoryChart({ data: d }) {
  const labels = Object.keys(d.categorias),
    values = Object.values(d.categorias),
    colors = ["#c71e2d", "#f16a78", "#b77b8a", "#7e4657", "#e8afb8"];
  if (!labels.length)
    return (
      <Empty
        title="Aún sin ventas"
        text="Las categorías aparecerán al aprobar pedidos."
      />
    );
  return (
    <div className="category-chart">
      <div className="donut-wrap">
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: colors,
                borderColor: "transparent",
                borderWidth: 4,
                hoverOffset: 4,
                borderRadius: 4,
              },
            ],
          }}
          options={{
            cutout: "80%",
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: { label: (c) => c.label + ": " + money(c.raw) },
              },
            },
          }}
        />
        <div className="donut-center">
          <span>Ventas totales</span>
          <strong>{money(d.ventas)}</strong>
          <small>en este período</small>
        </div>
      </div>
      <div className="chart-legend">
        {labels.map((l, i) => (
          <div key={l}>
            <span>
              <i style={{ background: colors[i % colors.length] }} />
              {l}
            </span>
            <strong>
              {Number(d.ventas)
                ? Math.round((Number(values[i]) / Number(d.ventas)) * 100)
                : 0}
              %
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
export async function downloadSales(days, notify) {
  try {
    const all = await api("/admin/orders");
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Lima",
    });
    const start = new Date(today + "T12:00:00");
    start.setDate(start.getDate() - days + 1);
    const selected = all.filter(
      (o) =>
        o.estado === "APROBADO" &&
        new Date(o.fecha) >=
          new Date(start.toISOString().slice(0, 10) + "T00:00:00") &&
        o.fecha.slice(0, 10) <= today,
    );
    exportCsv("lirio-ventas-" + days + "-dias", [
      ["Pedido", "Fecha", "Cliente", "Correo", "Método", "Estado", "Total PEN"],
      ...selected.map((o) => [
        o.numero,
        o.fecha,
        o.nombre,
        o.email,
        o.metodoPago,
        o.estado,
        o.total,
      ]),
    ]);
    notify("Reporte descargado");
  } catch (e) {
    notify(e.message, "error");
  }
}
export default function Dashboard({ reports = false }) {
  const { user, notify } = useStore(),
    [days, setDays] = useState(7),
    {
      data: d,
      loading,
      error,
      refresh,
    } = useApi("/admin/summary?days=" + days);
  return (
    <>
      <PageHeading
        eyebrow={
          reports
            ? "DECISIONES CON INFORMACIÓN"
            : "UNA VISTA CLARA DE TU NEGOCIO"
        }
        title={
          reports
            ? "Tus números, en perspectiva."
            : "Hola, " + user.nombre + "."
        }
        text={
          reports
            ? "Ventas aprobadas e inventario, con cifras del servidor."
            : "Un buen día para seguir creciendo. Así va El Lirio."
        }
      >
        <button
          className="btn secondary"
          onClick={() => downloadSales(days, notify)}
        >
          <FiDownload /> Exportar reporte
        </button>
        <Link className="btn primary" to="/admin/ventas/nueva">
          <FiPlus /> Nueva venta
        </Link>
      </PageHeading>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox message={error} retry={refresh} />
      ) : (
        d && (
          <>
            <div className="period-bar">
              <span>
                Resumen del negocio{" "}
                <span className="period-date">
                  {date(d.desde + "T12:00:00")} — {date(d.hasta + "T12:00:00")}
                </span>
              </span>
              <div className="segmented" aria-label="Período del reporte">
                {[7, 30, 90].map((n) => (
                  <button
                    key={n}
                    className={days === n ? "active" : ""}
                    aria-pressed={days === n}
                    onClick={() => setDays(n)}
                  >
                    {n} días
                  </button>
                ))}
              </div>
            </div>
            <Stats data={d} />
            <div className="dashboard-charts">
              <section className="glass panel">
                <div className="panel-heading">
                  <div>
                    <h2>El ritmo de tus ventas</h2>
                    <p>Cada compra cuenta.</p>
                  </div>
                  <span className="chart-key">
                    <i /> Ventas aprobadas
                  </span>
                </div>
                <div className="chart-total">
                  <strong>{money(d.ventas)}</strong>
                  <span>{d.pedidosAprobados} pedidos aprobados</span>
                </div>
                <SalesChart data={d} />
              </section>
              <section className="glass panel">
                <div className="panel-heading">
                  <div>
                    <h2>Una despensa diversa</h2>
                    <p>Ventas por categoría</p>
                  </div>
                  <span className="subtle-icon">
                    <FiPackage />
                  </span>
                </div>
                <CategoryChart data={d} />
              </section>
            </div>
            {reports && (
              <div className="report-metrics">
                <article className="glass panel">
                  <span className="eyebrow">MARGEN BRUTO</span>
                  <h2>{money(d.margenBruto)}</h2>
                  <p>
                    Ventas aprobadas menos costo de los productos al momento de
                    la venta. No descuenta gastos ni equivale a utilidad neta.
                  </p>
                </article>
                <article className="glass panel">
                  <span className="eyebrow">TICKET PROMEDIO</span>
                  <h2>{money(d.ticketPromedio)}</h2>
                  <p>
                    Total de ventas aprobadas dividido entre{" "}
                    {d.pedidosAprobados} pedidos aprobados en el período.
                  </p>
                </article>
              </div>
            )}
            <div className="dashboard-bottom">
              <section className="glass panel recent-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Los últimos movimientos</h2>
                    <p>Pedidos del período seleccionado</p>
                  </div>
                  <Link className="text-link" to="/admin/pedidos">
                    Ver todos <FiArrowUpRight />
                  </Link>
                </div>
                {d.recientes.length ? (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Pedido / cliente</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th className="right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.recientes.map((o) => (
                          <tr key={o.id}>
                            <td>
                              <Link to={"/admin/pedidos?id=" + o.id}>
                                <strong>{o.nombre}</strong>
                                <small>{o.numero}</small>
                              </Link>
                            </td>
                            <td className="muted">{date(o.fecha)}</td>
                            <td>
                              <Status value={o.estado} />
                            </td>
                            <td className="right">
                              <strong>{money(o.total)}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty
                    title="Un nuevo comienzo"
                    text="Los pedidos del período aparecerán aquí."
                  />
                )}
              </section>
              <section className="glass panel low-stock-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Un poco de atención</h2>
                    <p>Productos que necesitan reposición</p>
                  </div>
                  <span className="alert-number">{d.stockBajo.length}</span>
                </div>
                {d.stockBajo.length ? (
                  d.stockBajo.slice(0, 3).map((p) => (
                    <div className="low-stock-item" key={p.id}>
                      <img src={imageUrl(p.imagen)} alt="" />
                      <span>
                        <strong>{p.nombre}</strong>
                        <small>Mínimo: {p.stockMinimo} unidades</small>
                      </span>
                      <b>
                        {p.stock} <small>uds.</small>
                      </b>
                    </div>
                  ))
                ) : (
                  <div className="healthy-stock">
                    <FiCheckCircleFallback />
                    <span>
                      Todo en su lugar.
                      <br />
                      Tu stock está al día.
                    </span>
                  </div>
                )}
                <Link
                  className="btn secondary full"
                  to="/admin/inventario?stock=bajo"
                >
                  Revisar inventario <FiArrowRight />
                </Link>
              </section>
            </div>
            <div className="dashboard-footnote">
              <FiAlertCircle /> Las ventas incluyen solo pedidos aprobados. El
              inventario se valora al costo registrado. Moneda: PEN.
            </div>
          </>
        )
      )}
    </>
  );
}
function FiCheckCircleFallback() {
  return <FiPackage />;
}
