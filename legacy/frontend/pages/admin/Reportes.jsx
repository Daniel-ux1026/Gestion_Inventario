import React, { useState } from "react";

const Reportes = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const manejarGeneracion = (reporte) => {
        if (!fechaInicio || !fechaFin) {
            alert('Selecciona ambas fechas antes de generar un reporte.');
            return;
        }
        alert(`📊 Generando "${reporte}" desde ${fechaInicio} hasta ${fechaFin}`);
    };

    const reportes = [
        { titulo: 'Reporte de Ventas', desc: 'Análisis detallado de ventas por periodo, categoría, vendedor y más.' },
        { titulo: 'Estado de Inventario', desc: 'Análisis de stock, productos en riesgo, rotación y valorización.' },
        { titulo: 'Análisis de Clientes', desc: 'Segmentación, compras recurrentes, valor promedio de ticket.' },
        { titulo: 'Órdenes de Compra', desc: 'Detalles de compras, proveedores, costos y comparativos.' },
        { titulo: 'Estado Financiero', desc: 'Resumen de ingresos, egresos, ganancia bruta y márgenes.' },
        { titulo: 'Rendimiento del Personal', desc: 'Ventas por vendedor, eficiencia y análisis de productividad.' },
        { titulo: 'Kardex', desc: 'Movimientos de entrada y salida de productos, organizados por fecha y tipo.' },
    ];

    return (
        <div className="container mt-4">
            <h4 className="mb-4">Reportes</h4>
            <div className="row mb-4">
                <div className="col-md-3">
                    <label>Fecha Inicio:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label>Fecha Fin:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button
                        className="btn btn-primary"
                        onClick={() => alert(`🔍 Filtro aplicado: ${fechaInicio} a ${fechaFin}`)}
                    >
                        Aplicar
                    </button>
                </div>
            </div>
            <div className="row g-4">
                {reportes.map((reporte, idx) => (
                    <div className="col-md-4" key={idx}>
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h6 className="card-title">{reporte.titulo}</h6>
                                    <p className="card-text">{reporte.desc}</p>
                                </div>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => manejarGeneracion(reporte.titulo)}
                                >
                                    Generar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reportes;
