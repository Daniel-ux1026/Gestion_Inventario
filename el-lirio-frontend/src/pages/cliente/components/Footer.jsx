const Footer = () => (
    <footer
        className="text-light py-4 mt-auto"
        style={{
            backgroundColor: '#1a1a1a',
            fontSize: '0.85rem',
            width: '100%',
            minHeight: '100px',
        }}
    >
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap text-center text-md-start">
                <div className="mb-3 mb-md-0">
                    <p className="mb-1 fw-bold">Medios de Pago</p>
                    <div>
                        <i className="bi bi-credit-card me-2"></i>
                        <i className="bi bi-youtube me-2"></i>
                        <i className="bi bi-linkedin"></i>
                    </div>
                </div>

                <div className="mb-3 mb-md-0">
                    <p className="mb-1">Inversiones El Lirio de los Valles S.A.C.</p>
                    <p className="mb-0">RUC 20480466938 — Todos los derechos reservados.</p>
                </div>

                <div>
                    <p className="mb-1 fw-bold">Libro de Reclamaciones</p>
                    <p>Síguenos en nuestras redes</p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
