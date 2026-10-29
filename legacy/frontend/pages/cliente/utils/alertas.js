import Swal from 'sweetalert2';

// ✅ Alerta tipo TOAST para añadir producto
export function alertaAgregadoAlCarrito(nombre) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `"${nombre}" fue agregado al carrito`,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        background: '#f0fff0',
        color: '#2e7d32',
    });
}

// ✅ Alerta tipo modal para compra exitosa
export function alertaCompraExitosa() {
    Swal.fire({
        icon: 'success',
        title: 'Pedido realizado',
        text: 'Gracias por tu compra.',
        confirmButtonColor: '#198754',
        confirmButtonText: 'Aceptar',
    });
}

// ⚠️ Alerta cuando no se sube comprobante
export function alertaErrorComprobante() {
    Swal.fire({
        icon: 'warning',
        title: 'Comprobante requerido',
        text: 'Por favor sube el comprobante de pago.',
        confirmButtonColor: '#dc3545',
    });
}

// ℹ️ Alerta tipo TOAST para producto eliminado
export function alertaProductoEliminado(nombre) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: `"${nombre}" fue retirado del carrito`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: '#f8f9fa',
        color: '#333',
    });
}
