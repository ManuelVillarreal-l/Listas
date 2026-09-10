import * as readline from "readline";

interface Pedido {
    id: number;
    cliente: string;
    producto: string;
    cantidad: number;
    precio: number;
    estado: string;
}

const pedidos: Pedido[] = [];
let siguienteId = 1;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function preguntar(mensaje: string): Promise<string> {
    return new Promise<string>((resolve) => {
        rl.question(mensaje, (respuesta: string) => resolve(respuesta.trim()));
    });
}

function dinero(valor: number): string {
    return `$${valor.toLocaleString("es-CO")}`;
}

function mostrarPedido(pedido: Pedido): void {
    const total = pedido.cantidad * pedido.precio;
    console.log(
        `ID: ${pedido.id} | Cliente: ${pedido.cliente} | Producto: ${pedido.producto} | ` +
        `Cantidad: ${pedido.cantidad} | Total: ${dinero(total)} | Estado: ${pedido.estado}`
    );
}

async function registrarPedido(): Promise<void> {
    console.log("\n--- REGISTRAR PEDIDO ---");
    const cliente = await preguntar("Cliente: ");
    const producto = await preguntar("Producto: ");
    const cantidad = Number(await preguntar("Cantidad: "));
    const precio = Number(await preguntar("Precio unitario: "));

    if (!cliente || !producto || !Number.isFinite(cantidad) || cantidad <= 0 ||
        !Number.isFinite(precio) || precio <= 0) {
        console.log("Datos inválidos. No se registró el pedido.");
        return;
    }

    const pedido: Pedido = {
        id: siguienteId++,
        cliente,
        producto,
        cantidad,
        precio,
        estado: "Solicitud"
    };

    pedidos.push(pedido);
    console.log("\nPedido registrado correctamente:");
    mostrarPedido(pedido);
}

function mostrarPedidos(): void {
    console.log("\n--- LISTA DE PEDIDOS ---");
    if (pedidos.length === 0) {
        console.log("No hay pedidos registrados.");
        return;
    }
    for (const pedido of pedidos) mostrarPedido(pedido);
}

async function buscarPedido(): Promise<void> {
    console.log("\n--- BUSCAR PEDIDO ---");
    const id = Number(await preguntar("ID del pedido: "));
    const pedido = pedidos.find((elemento) => elemento.id === id);
    pedido ? mostrarPedido(pedido) : console.log("No se encontró el pedido.");
}

async function modificarEstado(): Promise<void> {
    console.log("\n--- MODIFICAR ESTADO ---");
    const id = Number(await preguntar("ID del pedido: "));
    const pedido = pedidos.find((elemento) => elemento.id === id);

    if (!pedido) {
        console.log("No se encontró el pedido.");
        return;
    }

    console.log("1. Solicitud");
    console.log("2. Cotización");
    console.log("3. Aprobado");
    console.log("4. Pedido preparado");
    console.log("5. Pedido revisado");
    console.log("6. Enviado");
    console.log("7. Pagado");
    console.log("8. Entregado");
    console.log("9. Rechazado");

    const opcion = await preguntar("Nuevo estado: ");
    const estados: Record<string, string> = {
        "1": "Solicitud", "2": "Cotización", "3": "Aprobado",
        "4": "Pedido preparado", "5": "Pedido revisado",
        "6": "Enviado", "7": "Pagado", "8": "Entregado", "9": "Rechazado"
    };

    if (!(opcion in estados)) {
        console.log("Opción inválida.");
        return;
    }

    pedido.estado = estados[opcion];
    console.log("Estado actualizado:");
    mostrarPedido(pedido);
}

async function eliminarPedido(): Promise<void> {
    console.log("\n--- ELIMINAR PEDIDO ---");
    const id = Number(await preguntar("ID del pedido: "));
    const posicion = pedidos.findIndex((elemento) => elemento.id === id);

    if (posicion === -1) {
        console.log("No se encontró el pedido.");
        return;
    }

    pedidos.splice(posicion, 1);
    console.log("Pedido eliminado correctamente.");
}

async function filtrarPedidos(): Promise<void> {
    console.log("\n--- FILTRAR PEDIDOS ---");
    const estado = await preguntar("Estado: ");
    const encontrados = pedidos.filter(
        (pedido) => pedido.estado.toLowerCase() === estado.toLowerCase()
    );

    if (encontrados.length === 0) {
        console.log("No hay pedidos con ese estado.");
        return;
    }

    encontrados.forEach((pedido) => mostrarPedido(pedido));
}

function calcularTotal(): void {
    console.log("\n--- VALOR TOTAL ---");
    const total = pedidos.reduce(
        (acumulado, pedido) => acumulado + pedido.cantidad * pedido.precio, 0
    );
    console.log(`Valor total de los pedidos: ${dinero(total)}`);
}

async function procesarPedido(): Promise<void> {
    console.log("\n--- PROCESAR PEDIDO SEGÚN EL DIAGRAMA ---");
    const id = Number(await preguntar("ID del pedido: "));
    const pedido = pedidos.find((elemento) => elemento.id === id);

    if (!pedido) {
        console.log("No se encontró el pedido.");
        return;
    }

    pedido.estado = "Solicitud";
    console.log("1. Se prepara la solicitud.");
    pedido.estado = "Cotización";
    console.log("2. Se prepara y revisa la cotización.");

    const aprobado = (await preguntar("¿El supervisor aprueba? (s/n): ")).toLowerCase();
    if (aprobado !== "s") {
        pedido.estado = "Rechazado";
        console.log("Solicitud rechazada.");
        return;
    }

    pedido.estado = "Aprobado";
    console.log("3. Solicitud aprobada.");

    const cotizacion = (await preguntar("¿La cotización es aceptable? (s/n): ")).toLowerCase();
    if (cotizacion !== "s") {
        pedido.estado = "Cotización";
        console.log("Cotización no aceptada. Se debe revisar.");
        return;
    }

    pedido.estado = "Pedido preparado";
    console.log("4. Se prepara el pedido.");
    pedido.estado = "Pedido revisado";
    console.log("5. Se revisa el pedido.");

    const pedidoAceptable = (await preguntar("¿El pedido es aceptable? (s/n): ")).toLowerCase();
    if (pedidoAceptable !== "s") {
        pedido.estado = "Cotización";
        console.log("Pedido no aceptado. Se debe realizar una nueva cotización.");
        return;
    }

    pedido.estado = "Enviado";
    console.log("6. Pedido enviado.");
    pedido.estado = "Pagado";
    console.log("7. Se prepara la factura y se registra el pago.");
    pedido.estado = "Entregado";
    console.log("8. Producto recibido. PROCESO FINALIZADO.");
    mostrarPedido(pedido);
}

async function menu(): Promise<void> {
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
            case "9":
                console.log("Programa finalizado.");
                rl.close();
                return;
            default:
                console.log("Opción inválida.");
        }
    }
}

console.log("TALLER DE LISTAS APLICADO A LA GESTIÓN DE PEDIDOS");
console.log("Caso de estudio: gestión de pedidos en una tienda.");
menu();
