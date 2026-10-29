const Footer = () => (
    <footer className="footer bg-dark text-light pt-5 pb-3 mt-auto">
        <div className="container">
            <div className="row footer-content gx-5 gy-4">
                {/* Medios de Pago */}
                <div className="col-12 col-sm-6 col-md-3 footer-section">
                    <h6>Medios de Pago</h6>
                    <p className="small">Aceptamos diversos métodos de pago para tu comodidad:</p>
                    <div className="d-flex gap-2 flex-wrap">
                        <span className="badge bg-secondary mb-1">Efectivo</span>
                        <span className="badge bg-secondary mb-1">Tarjeta</span>
                        <span className="badge bg-secondary mb-1">Yape</span>
                        <span className="badge bg-secondary mb-1">Plin</span>
                        <span className="badge bg-secondary mb-1">Transferencia</span>
                    </div>
                </div>
                {/* Información Legal */}
                <div className="col-12 col-sm-6 col-md-3 footer-section">
                    <h6>Información Legal</h6>
                    <p className="small mb-1">Inversiones El Lirio de los Valles S.A.C.</p>
                    <p className="small mb-1">RUC: 20484060538</p>
                    <p className="small mb-0">Todos los derechos reservados.</p>
                </div>
                {/* Libro de reclamaciones */}
                <div className="col-12 col-sm-6 col-md-3 footer-section">
                    <h6>
                        <a href="#" className="text-decoration-none text-light">Libro de reclamaciones</a>
                    </h6>
                    <p className="small mb-0">
                        Estamos comprometidos con brindar el mejor servicio. Si tienes alguna queja o sugerencia, no dudes en contactarnos.
                    </p>
                </div>
                {/* Redes sociales */}
                <div className="col-12 col-sm-6 col-md-3 footer-section">
                    <h6>Redes sociales</h6>
                    <p className="small mb-2">Síguenos en nuestras redes sociales para estar al día con nuestras ofertas y novedades.</p>
                    <div className="social-icons d-flex gap-2 mt-2">
                        <a href="#" className="social-icon" title="Twitter"><i className="bi bi-twitter-x"></i></a>
                        <a href="#" className="social-icon" title="Instagram"><i className="bi bi-instagram"></i></a>
                        <a href="#" className="social-icon" title="YouTube"><i className="bi bi-youtube"></i></a>
                        <a href="#" className="social-icon" title="LinkedIn"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom border-top pt-3 text-center mt-4" style={{ color: "#95a5a6" }}>
                <small>© 2024 Inversiones El Lirio de los Valles S.A.C. - RUC 20484060538. Todos los derechos reservados.</small>
            </div>
        </div>
    </footer>
);

export default Footer;
