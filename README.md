# TALLER DE LISTAS - GESTIÓN DE PEDIDOS

## IMPORTANTE
Esta versión está preparada para ejecutarse sin instalar TypeScript ni ejecutar `tsc`.
El archivo `src/main.ts` contiene el código TypeScript para entregar y estudiar.
El archivo `dist/main.js` es la versión JavaScript ya preparada para ejecutarse con Node.

## EJECUTAR EN VISUAL STUDIO CODE

Abra directamente esta carpeta. Debe ver `package.json`, `src` y `dist`.

En la terminal escriba solamente:

npm run ejecutar

No es necesario ejecutar `npm install`.

También funciona directamente con:

node dist/main.js

## OPERACIONES DE LISTAS
- push(): agregar pedidos.
- for...of: recorrer la lista.
- find(): buscar pedidos.
- findIndex() y splice(): eliminar pedidos.
- modificación directa: cambiar el estado.
- filter(): filtrar pedidos.
- forEach(): recorrer resultados.
- reduce(): calcular el total.

## FLUJO DEL DIAGRAMA
Solicitud -> Cotización -> Aprobación -> aceptación de cotización ->
preparación -> revisión -> aceptación del pedido -> envío ->
pago/factura -> entrega.

La opción 8 permite demostrar el flujo completo mediante preguntas de decisión.
