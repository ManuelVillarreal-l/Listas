const readline = require("readline");

const pedidos = [];
let siguienteId = 1;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function preguntar(mensaje) {
    return new Promise((resolve) => {
        rl.question(mensaje, (respuesta) => resolve(respuesta.trim()));
    });
}

function dinero(valor) {
    return `$${valor.toLocaleString("es-CO")}`;
}

function mostrarPedido(pedido) {
    const total = pedido.cantidad * pedido.precio;
    console.log(`ID: ${pedido.id} | Cliente: ${pedido.cliente} | Producto: ${pedido.producto} | Cantidad: ${pedido.cantidad} | Total: ${dinero(total)} | Estado: ${pedido.estado}`);
}

async function registrarPedido() {
    console.log("\n--- REGISTRAR PEDIDO ---");
    const cliente = await preguntar("Cliente: ");
    const producto = await preguntar("Producto: ");
    const cantidad = Number(await preguntar("Cantidad: "));
    const precio = Number(await preguntar("Precio unitario: "));
    if (!cliente || !producto || !Number.isFinite(cantidad) || cantidad <= 0 || !Number.isFinite(precio) || precio <= 0) {
        console.log("Datos inválidos. No se registró el pedido.");
        return;
    }
    const pedido = { id: siguienteId++, cliente, producto, cantidad, precio, estado: "Solicitud" };
    pedidos.push(pedido);
    console.log("\nPedido registrado correctamente:");
    mostrarPedido(pedido);
}

function mostrarPedidos() {
    console.log("\n--- LISTA DE PEDIDOS ---");
    if (pedidos.length === 0) return console.log("No hay pedidos registrados.");
    for (const pedido of pedidos) mostrarPedido(pedido);
}

async function buscarPedido() {
    console.log("\n--- BUSCAR PEDIDO ---");
    const id = Number(await preguntar("ID del pedido: "));
    const pedido = pedidos.find((elemento) => elemento.id === id);
    pedido ? mostrarPedido(pedido) : console.log("No se encontró el pedido.");
}

async function modificarEstado() {
    console.log("\n--- MODIFICAR ESTADO ---");
    const id = Number(await preguntar("ID del pedido: "));
    const pedido = pedidos.find((elemento) => elemento.id === id);
    if (!pedido) return console.log("No se encontró el pedido.");
    console.log("1. Solicitud\n2. Cotización\n3. Aprobado\n4. Pedido preparado\n5. Pedido revisado\n6. Enviado\n7. Pagado\n8. Entregado\n9. Rechazado");
    const opcion = await preguntar("Nuevo estado: ");
    const estados = {"1":"Solicitud","2":"Cotización","3":"Aprobado","4":"Pedido preparado","5":"Pedido revisado","6":"Enviado","7":"Pagado","8":"Entregado","9":"Rechazado"};
    if (!(opcion in estados)) return console.log("Opción inválida.");
    pedido.estado = estados[opcion];
    console.log("Estado actualizado:");
    mostrarPedido(pedido);
}

async function eliminarPedido() {
    console.log("\n--- ELIMINAR PEDIDO ---");
    const id = Number(await preguntar("ID del pedido: "));
    const posicion = pedidos.findIndex((elemento) => elemento.id === id);
    if (posicion === -1) return console.log("No se encontró el pedido.");
    pedidos.splice(posicion, 1);
    console.log("Pedido eliminado correctamente.");
}

async function filtrarPedidos() {
    console.log("\n--- FILTRAR PEDIDOS ---");
    const estado = await preguntar("Estado: ");
    const encontrados = pedidos.filter((pedido) => pedido.estado.toLowerCase() === estado.toLowerCase());
    if (encontrados.length === 0) return console.log("No hay pedidos con ese estado.");
    encontrados.forEach((pedido) => mostrarPedido(pedido));
}

function calcularTotal() {
    console.log("\n--- VALOR TOTAL ---");
    const total = pedidos.reduce((acumulado, pedido) => acumulado + pedido.cantidad * pedido.precio, 0);
    console.log(`Valor total de los pedidos: ${dinero(total)}`);
}

async function procesarPedido() {
    console.log("\n--- PROCESAR PEDIDO SEGÚN EL DIAGRAMA ---");
    const id = Number(await preguntar("ID del pedido: "));
    const pedido = pedidos.find((elemento) => elemento.id === id);
    if (!pedido) return console.log("No se encontró el pedido.");

    pedido.estado = "Solicitud"; console.log("1. Se prepara la solicitud.");
    pedido.estado = "Cotización"; console.log("2. Se prepara y revisa la cotización.");

    const aprobado = (await preguntar("¿El supervisor aprueba? (s/n): ")).toLowerCase();
    if (aprobado !== "s") { pedido.estado = "Rechazado"; return console.log("Solicitud rechazada."); }

    pedido.estado = "Aprobado"; console.log("3. Solicitud aprobada.");
    const cotizacion = (await preguntar("¿La cotización es aceptable? (s/n): ")).toLowerCase();
    if (cotizacion !== "s") { pedido.estado = "Cotización"; return console.log("Cotización no aceptada. Se debe revisar."); }

    pedido.estado = "Pedido preparado"; console.log("4. Se prepara el pedido.");
    pedido.estado = "Pedido revisado"; console.log("5. Se revisa el pedido.");
    const pedidoAceptable = (await preguntar("¿El pedido es aceptable? (s/n): ")).toLowerCase();
    if (pedidoAceptable !== "s") { pedido.estado = "Cotización"; return console.log("Pedido no aceptado. Se debe realizar una nueva cotización."); }

    pedido.estado = "Enviado"; console.log("6. Pedido enviado.");
    pedido.estado = "Pagado"; console.log("7. Se prepara la factura y se registra el pago.");
    pedido.estado = "Entregado"; console.log("8. Producto recibido. PROCESO FINALIZADO.");
    mostrarPedido(pedido);
}

async function menu() {
    while (true) {
        console.log("\n==============================================");
        console.log(" SISTEMA DE GESTIÓN DE PEDIDOS - LISTAS");
        console.log("==============================================");
        console.log("1. Registrar pedido");
        console.log("2. Mostrar pedidos");
        console.log("3. Buscar pedido");
        console.log("4. Modificar estado");
        console.log("5. Eliminar pedido");
        console.log("6. Filtrar por estado");
        console.log("7. Calcular valor total");
        console.log("8. Procesar pedido según el diagrama");
        console.log("9. Salir");
        const opcion = await preguntar("Seleccione una opción: ");
        switch (opcion) {
            case "1": await registrarPedido(); break;
            case "2": mostrarPedidos(); break;
            case "3": await buscarPedido(); break;
            case "4": await modificarEstado(); break;
            case "5": await eliminarPedido(); break;
            case "6": await filtrarPedidos(); break;
            case "7": calcularTotal(); break;
            case "8": await procesarPedido(); break;
            case "9": console.log("Programa finalizado."); rl.close(); return;
            default: console.log("Opción inválida.");
        }
    }
}

console.log("TALLER DE LISTAS APLICADO A LA GESTIÓN DE PEDIDOS");
console.log("Caso de estudio: gestión de pedidos en una tienda.");
menu();
