// js/utils/helpers.js
// Funciones de utilidad y helpers

const helpers = {
    /**
     * Formatear fecha a string legible
     */
    formatearFecha: (fecha, formato = 'DD/MM/YYYY') => {
        if (!fecha) return '';

        const date = new Date(fecha);
        if (isNaN(date.getTime())) return '';

        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        const horas = String(date.getHours()).padStart(2, '0');
        const minutos = String(date.getMinutes()).padStart(2, '0');

        switch (formato) {
            case 'DD/MM/YYYY':
                return `${dia}/${mes}/${año}`;
            case 'DD/MM/YYYY HH:mm':
                return `${dia}/${mes}/${año} ${horas}:${minutos}`;
            case 'YYYY-MM-DD':
                return `${año}-${mes}-${dia}`;
            default:
                return `${dia}/${mes}/${año}`;
        }
    },

    /**
     * Formatear número como moneda
     */
    formatearMoneda: (cantidad, simbolo = '€') => {
        if (isNaN(cantidad)) return `${simbolo}0.00`;

        return `${simbolo}${Number(cantidad).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    },

    /**
     * Formatear número con separadores de miles
     */
    formatearNumero: (numero) => {
        if (isNaN(numero)) return '0';
        return Number(numero).toLocaleString('es-ES');
    },

    /**
     * Capitalizar primera letra
     */
    capitalizar: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Capitalizar cada palabra
     */
    capitalizarPalabras: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.split(' ')
            .map(palabra => helpers.capitalizar(palabra))
            .join(' ');
    },

    /**
     * Truncar texto con puntos suspensivos
     */
    truncarTexto: (texto, longitud = 50) => {
        if (!texto || typeof texto !== 'string') return '';
        if (texto.length <= longitud) return texto;
        return texto.substring(0, longitud) + '...';
    },

    /**
     * Generar ID único
     */
    generarId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Debounce function para optimizar búsquedas
     */
    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    },

    /**
     * Throttle function para limitar ejecuciones
     */
    throttle: (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(null, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Validar email
     */
    validarEmail: (email) => {
        return CONSTANTS.PATRONES.EMAIL.test(email);
    },

    /**
     * Validar DNI peruano
     */
    validarDni: (dni) => {
        return CONSTANTS.PATRONES.DNI.test(dni);
    },

    /**
     * Validar teléfono peruano
     */
    validarTelefono: (telefono) => {
        return CONSTANTS.PATRONES.TELEFONO.test(telefono);
    },

    /**
     * Limpiar texto (quitar espacios extra, caracteres especiales)
     */
    limpiarTexto: (texto) => {
        if (!texto || typeof texto !== 'string') return '';
        return texto.trim().replace(/\s+/g, ' ');
    },

    /**
     * Convertir a slug (URL amigable)
     */
    convertirASlug: (texto) => {
        if (!texto || typeof texto !== 'string') return '';
        return texto
            .toLowerCase()
            .trim()
            .replace(/[àáäâ]/g, 'a')
            .replace(/[èéëê]/g, 'e')
            .replace(/[ìíïî]/g, 'i')
            .replace(/[òóöô]/g, 'o')
            .replace(/[ùúüû]/g, 'u')
            .replace(/[ñ]/g, 'n')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    },

    /**
     * Calcular porcentaje
     */
    calcularPorcentaje: (parte, total) => {
        if (!total || total === 0) return 0;
        return (parte / total) * 100;
    },

    /**
     * Calcular descuento
     */
    calcularDescuento: (precio, porcentajeDescuento) => {
        if (!precio || !porcentajeDescuento) return precio;
        return precio - (precio * porcentajeDescuento / 100);
    },

    /**
     * Generar código aleatorio
     */
    generarCodigo: (longitud = 8, incluirLetras = true, incluirNumeros = true) => {
        let caracteres = '';
        if (incluirLetras) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (incluirNumeros) caracteres += '0123456789';

        let resultado = '';
        for (let i = 0; i < longitud; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    },

    /**
     * Ordenar array de objetos por propiedad
     */
    ordenarPor: (array, propiedad, ascendente = true) => {
        return array.sort((a, b) => {
            let valorA = a[propiedad];
            let valorB = b[propiedad];

            // Manejar valores nulos/undefined
            if (valorA == null) valorA = '';
            if (valorB == null) valorB = '';

            // Convertir a string para comparación
            valorA = valorA.toString().toLowerCase();
            valorB = valorB.toString().toLowerCase();

            if (ascendente) {
                return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
            } else {
                return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
            }
        });
    },

    /**
     * Filtrar array por múltiples propiedades
     */
    filtrarPor: (array, termino, propiedades) => {
        if (!termino) return array;

        const terminoLower = termino.toLowerCase();
        return array.filter(item =>
            propiedades.some(prop => {
                const valor = item[prop];
                return valor && valor.toString().toLowerCase().includes(terminoLower);
            })
        );
    },

    /**
     * Agrupar array por propiedad
     */
    agruparPor: (array, propiedad) => {
        return array.reduce((grupos, item) => {
            const clave = item[propiedad];
            if (!grupos[clave]) {
                grupos[clave] = [];
            }
            grupos[clave].push(item);
            return grupos;
        }, {});
    },

    /**
     * Obtener valor anidado de un objeto
     */
    obtenerValorAnidado: (objeto, ruta, valorPorDefecto = null) => {
        const propiedades = ruta.split('.');
        let resultado = objeto;

        for (const propiedad of propiedades) {
            if (resultado == null || typeof resultado !== 'object') {
                return valorPorDefecto;
            }
            resultado = resultado[propiedad];
        }

        return resultado !== undefined ? resultado : valorPorDefecto;
    },

    /**
     * Copiar texto al portapapeles
     */
    copiarAlPortapapeles: async (texto) => {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch (error) {
            // Fallback para navegadores más antiguos
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },

    /**
     * Descargar archivo como JSON
     */
    descargarJSON: (datos, nombreArchivo = 'datos.json') => {
        const dataStr = JSON.stringify(datos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = nombreArchivo;
        link.click();
    },

    /**
     * Descargar archivo como CSV
     */
    descargarCSV: (datos, nombreArchivo = 'datos.csv') => {
        if (!datos.length) return;

        const headers = Object.keys(datos[0]);
        const csvContent = [
            headers.join(','),
            ...datos.map(row => headers.map(header => {
                const valor = row[header];
                return typeof valor === 'string' && valor.includes(',')
                    ? `"${valor}"`
                    : valor;
            }).join(','))
        ].join('\n');

        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = nombreArchivo;
        link.click();
    },

    /**
     * Mostrar notificación del navegador
     */
    mostrarNotificacion: (titulo, opciones = {}) => {
        if (!('Notification' in window)) {
            console.log('Este navegador no soporta notificaciones');
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(titulo, opciones);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(titulo, opciones);
                }
            });
        }
    }
};

// Exportar para uso global
window.helpers = helpers;