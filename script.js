document.addEventListener('DOMContentLoaded', () => {
    const inputProducto = document.getElementById('producto');
    const botonAgregarProducto = document.getElementById('botonAgregarProducto');
    const listaProductos = document.getElementById('listaProductos');
    const sumaTotal = document.getElementById('sumaTotal');

    let total = 0; // Variable para almacenar el total

    function cargarProducto() {
        const productosGuardados = localStorage.getItem('productos_decompras'); // Cambiado
        if (productosGuardados) {
            productosGuardados.split(',').forEach(producto => {
                const [productoTexto, precio, cantidad, marcado] = producto.split('|');
                crearProducto(productoTexto, parseFloat(precio), parseFloat(cantidad), marcado === 'true');
            });
        }
    }

    function agregarProducto() {
        const nuevoProducto = inputProducto.value.trim();
        if (nuevoProducto) {
            crearProducto(nuevoProducto, 0, 1, false); // Precio inicial: 0, Cantidad inicial: 1, Marcado inicial: false
            guardarProducto(nuevoProducto, 0, 1, false);
            inputProducto.value = '';
            inputProducto.placeholder = 'Otro producto';
        } else {
            alert('Por favor, ingresa un producto válido.');
        }
        inputProducto.focus();
    }

    function crearProducto(productoTexto, precio = 0, cantidad = 1, marcado = false) {
        const productoCreado = document.createElement('li');
        productoCreado.classList.add('productoCreado');

        const textoProducto = document.createElement('span');
        textoProducto.textContent = productoTexto;

       
        const inputPrecio = document.createElement('input');
        inputPrecio.type = 'number';
        inputPrecio.placeholder = 'Precio';
        inputPrecio.min = 0;
        inputPrecio.step = 0.01;
        inputPrecio.value = precio;
        inputPrecio.classList.add('inputPrecio');

       
        inputPrecio.addEventListener('focus', () => {
            if (parseFloat(inputPrecio.value) === 0) {
                inputPrecio.value = '';
            }
        });

        
        inputPrecio.addEventListener('blur', () => {
            if (inputPrecio.value === '') {
                inputPrecio.value = 0;
            }
        });

        
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.placeholder = 'Cantidad';
        inputCantidad.min = 1;
        inputCantidad.step = 1;
        inputCantidad.value = cantidad;
        inputCantidad.classList.add('inputCantidad');

       
        const actualizarTotal = () => {
            const nuevoPrecio = parseFloat(inputPrecio.value) || 0;
            const nuevaCantidad = parseFloat(inputCantidad.value) || 1;
            const subtotal = nuevoPrecio * nuevaCantidad;

            
            total -= (parseFloat(inputPrecio.dataset.prevPrecio) || 0) * (parseFloat(inputCantidad.dataset.prevCantidad) || 1);
            total += subtotal;

            
            inputPrecio.dataset.prevPrecio = nuevoPrecio;
            inputCantidad.dataset.prevCantidad = nuevaCantidad;

          
            sumaTotal.textContent = total.toFixed(2);

            
            actualizarProductoEnLocalStorage(productoTexto, nuevoPrecio, nuevaCantidad, marcado);
        };

       
        inputPrecio.addEventListener('input', actualizarTotal);
        inputCantidad.addEventListener('input', actualizarTotal);

       
        const botonMarcar = document.createElement('button');
        botonMarcar.textContent = '✓';
        botonMarcar.classList.add(marcado ? 'botonMarcado' : 'botonDesmarcado');
        botonMarcar.addEventListener('click', () => {
            botonMarcar.classList.toggle('botonMarcado');
            botonMarcar.classList.toggle('botonDesmarcado');
            marcado = !marcado; 
            actualizarProductoEnLocalStorage(productoTexto, parseFloat(inputPrecio.value), parseFloat(inputCantidad.value), marcado);
        });

        
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'X';
        botonEliminar.classList.add('botonEliminar');
        botonEliminar.addEventListener('click', () => {
           
            total -= (parseFloat(inputPrecio.value) || 0) * (parseFloat(inputCantidad.value) || 1);
            sumaTotal.textContent = total.toFixed(2);

            
            productoCreado.remove();
            eliminarProductoDeLocalStorage(productoTexto);
        });

        const divControles = document.createElement('div');
        divControles.append(botonMarcar, inputPrecio, inputCantidad, botonEliminar);

        productoCreado.append(textoProducto, divControles);
        listaProductos.appendChild(productoCreado);

        
        total += (parseFloat(inputPrecio.value) || 0) * (parseFloat(inputCantidad.value) || 1);
        sumaTotal.textContent = total.toFixed(2);
    }

    function guardarProducto(productoTexto, precio, cantidad, marcado) {
        const productosGuardados = localStorage.getItem('productos_decompras'); 
        const listaProductos = productosGuardados ? productosGuardados.split(',') : [];
        listaProductos.push(`${productoTexto}|${precio}|${cantidad}|${marcado}`);
        localStorage.setItem('productos_decompras', listaProductos.join(',')); 
    }

    function actualizarProductoEnLocalStorage(productoTexto, precio, cantidad, marcado) {
        const productosGuardados = localStorage.getItem('productos_decompras');
        if (productosGuardados) {
            const listaProductos = productosGuardados.split(',').map(producto => {
                const [texto, prec, cant, marc] = producto.split('|');
                return texto === productoTexto ? `${texto}|${precio}|${cantidad}|${marcado}` : producto;
            });
            localStorage.setItem('productos_decompras', listaProductos.join(',')); 
        }
    }

    function eliminarProductoDeLocalStorage(productoTexto) {
        const productosGuardados = localStorage.getItem('productos_decompras'); 
        if (productosGuardados) {
            const listaProductos = productosGuardados.split(',').filter(producto => {
                const [texto] = producto.split('|');
                return texto !== productoTexto;
            });
            localStorage.setItem('productos_decompras', listaProductos.join(',')); // Cambiado
        }
    }

    cargarProducto();
    inputProducto.focus();
    botonAgregarProducto.addEventListener('click', agregarProducto);
    inputProducto.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarProducto();
        }
    });
});
