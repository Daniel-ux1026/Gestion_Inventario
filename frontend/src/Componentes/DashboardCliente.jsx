import { useNavigate } from 'react-router-dom';


export default function DashboardCliente() {

    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí podrías agregar lógica adicional de logout si es necesario,
        // como limpiar tokens de autenticación, etc.
        navigate('/login'); // Redirige a la ruta de login
    };

    return (
        <div className="container mt-5">
            <h2>Panel de Cliente</h2>
            <p>Bienvenido, cliente.</p>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>Salir</button>
        </div>
    );
}
