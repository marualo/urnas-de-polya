// INTENTO QUE SE ENCUENTRA RESALTADO CON EL CURSOR

let intentoResaltado = null;

// HISTORIAL QUE SE ESTÁ MOSTRANDO

let historialEstadisticasActual = historialIntentos;

// CANTIDAD DE EXTRACCIONES DE TODAS LAS PARTIDAS

const TOTAL_EXTRACCIONES = 500;

// TÍTULO DE LAS ESTADÍSTICAS

let tituloEstadisticasActual = "Resumen de la partida";

// COLORES PARA DISTINGUIR LOS CINCO INTENTOS

const coloresIntentos = [
    "#087fc1",
    "#16865d",
    "#8b55b5",
    "#d17a16",
    "#d34f75"
];

// ESTILOS DE LÍNEA PARA DISTINGUIR LOS COLORES

const estilosLineas = [
    [],
    [7, 5],
    [2, 4]
];

// POSICIÓN VERTICAL DE LAS LEYENDAS

const inicioLeyendaY = 545;


// OBTENER LOS COLORES QUE PARTICIPAN EN LA PARTIDA

function obtenerColoresEstadisticas() {

    if (historialEstadisticasActual.length === 0) {
        return ["negra", "blanca"];
    }

    const primeraEvolucion =
        historialEstadisticasActual[0].evolucion[0];

    return Object.keys(primeraEvolucion)
        .filter(propiedad => propiedad !== "extraccion");

}


// OBTENER EL NOMBRE VISIBLE DEL COLOR

function obtenerNombreColor(color) {

    const nombres = {
        negra: "Negras",
        blanca: "Blancas",
        roja: "Rojas"
    };

    return nombres[color] || color;

}


// OBTENER EL EMOJI DEL COLOR

function obtenerEmojiEstadistica(color) {

    const emojis = {
        negra: "⚫",
        blanca: "⚪",
        roja: "🔴"
    };

    return emojis[color] || "";

}


// OBTENER EL NOMBRE DEL COLOR CON LA PRIMERA LETRA EN MAYÚSCULA

function obtenerNombreCapitalizado(color) {

    return color.charAt(0).toUpperCase() + color.slice(1);

}


// OBTENER LA INICIAL DEL COLOR

function obtenerInicialEstadistica(color) {

    const iniciales = {
        negra: "N",
        blanca: "B",
        roja: "R"
    };

    return iniciales[color] || "";

}


// OBTENER LA CANTIDAD FINAL DE UN COLOR

function obtenerCantidadColor(intento, color) {

    // PARA EL JUEGO PRINCIPAL

    const propiedadesPrincipales = {
        negra: "negras",
        blanca: "blancas",
        roja: "rojas"
    };

    const propiedad = propiedadesPrincipales[color];

    if (propiedad && intento[propiedad] !== undefined) {
        return intento[propiedad];
    }

    // PARA LAS VARIANTES

    const cantidades = intento.cantidades || {};

    const nombreColor = obtenerNombreCapitalizado(color);

    return cantidades[nombreColor] || 0;

}


// CALCULAR EL PORCENTAJE FINAL DE UN COLOR

function obtenerPorcentajeColor(intento, color) {

    const colores = obtenerColoresEstadisticas();

    // SUMAR LAS CANTIDADES DE TODOS LOS COLORES

    const total = colores.reduce(
        (suma, nombre) => suma + obtenerCantidadColor(intento, nombre),
        0
    );

    if (total === 0) {
        return 0;
    }

    return (obtenerCantidadColor(intento, color) / total) * 100;

}


// MOSTRAR LAS ESTADÍSTICAS DEL JUEGO PRINCIPAL

function mostrarEstadisticas() {

    historialEstadisticasActual = historialIntentos;

    tituloEstadisticasActual = "Resumen de la partida";

    intentoResaltado = null;

    actualizarEstadisticas();

}


// MOSTRAR LAS ESTADÍSTICAS DE UNA VARIANTE

function mostrarEstadisticasVariante(clave, nombreVariante) {

    const partida = partidasVariantes[clave];

    if (!partida || partida.historial.length === 0) {
        return;
    }

    historialEstadisticasActual = partida.historial;

    tituloEstadisticasActual =
        `Resumen de la partida - ${nombreVariante}`;

    intentoResaltado = null;

    actualizarEstadisticas();

    // DESPLAZAR LA PANTALLA HASTA LAS ESTADÍSTICAS

    document.querySelector("#estadisticas")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


// ACTUALIZAR EL CONTENIDO DE LAS ESTADÍSTICAS

function actualizarEstadisticas() {

    const contenedor = document.querySelector(
        "#estadisticas-contenido"
    );

    const totalIntentos = historialEstadisticasActual.length;

    // SI TODAVÍA NO HAY RESULTADOS

    if (totalIntentos === 0) {

        contenedor.innerHTML = `

            <h3>${tituloEstadisticasActual}</h3>

            <p>
                Todavía no hay resultados.
                Completá un intento para comenzar
                a generar estadísticas.
            </p>

        `;

        dibujarGraficoEvolucion();

        return;

    }

    const colores = obtenerColoresEstadisticas();

    // CONTAR LAS VICTORIAS DE CADA COLOR

    const victoriasPorColor = {};

    colores.forEach(color => {

        const nombreColor = obtenerNombreCapitalizado(color);

        victoriasPorColor[nombreColor] =
            historialEstadisticasActual.filter(
                intento => intento.ganador === nombreColor
            ).length;

    });

    // CONTAR LOS EMPATES

    const totalEmpates = historialEstadisticasActual.filter(
        intento => intento.ganador === "Empate"
    ).length;

    // CONTAR LAS PREDICCIONES CORRECTAS

    const totalCorrectas = historialEstadisticasActual.filter(
        intento =>
            intento.prediccion === intento.ganador &&
            intento.ganador !== "Empate"
    ).length;

    // CONTAR LAS PREDICCIONES INCORRECTAS

    const totalIncorrectas = historialEstadisticasActual.filter(
        intento =>
            intento.prediccion !== intento.ganador &&
            intento.ganador !== "Empate"
    ).length;

    // GENERAR EL RESUMEN DE VICTORIAS

    const resumenVictorias = colores.map(color => {

        const nombreColor = obtenerNombreCapitalizado(color);

        return `

            <p>
                ${obtenerEmojiEstadistica(color)}
                Victorias de las ${obtenerNombreColor(color).toLowerCase()}:
                ${victoriasPorColor[nombreColor]}
            </p>

        `;

    }).join("");

    // GENERAR LAS COLUMNAS DE LA TABLA

    const columnasColores = colores.map(color => `

        <th>${obtenerNombreColor(color)}</th>
        <th>% ${obtenerNombreColor(color)}</th>

    `).join("");

    // GENERAR LAS FILAS DEL HISTORIAL

    const filasHistorial = historialEstadisticasActual.map(intento => {

        const columnasCantidades = colores.map(color => `

            <td>${obtenerCantidadColor(intento, color)}</td>

            <td>
                ${obtenerPorcentajeColor(intento, color).toFixed(2)}%
            </td>

        `).join("");

        return `

            <tr>

                <td>${intento.intento}</td>
                <td>${intento.prediccion}</td>
                <td>${intento.ganador}</td>

                ${columnasCantidades}

            </tr>

        `;

    }).join("");

    // MOSTRAR EL RESUMEN Y EL HISTORIAL

    contenedor.innerHTML = `

        <h3>${tituloEstadisticasActual}</h3>

        <p>Intentos realizados: ${totalIntentos} de 5</p>

        ${resumenVictorias}

        <p>Empates: ${totalEmpates}</p>

        <p>Predicciones correctas: ${totalCorrectas}</p>

        <p>Predicciones incorrectas: ${totalIncorrectas}</p>

        <h3>Historial de intentos</h3>

        <div class="tabla-historial-contenedor">

            <table class="tabla-historial">

                <thead>

                    <tr>

                        <th>Intento</th>
                        <th>Predicción</th>
                        <th>Resultado</th>

                        ${columnasColores}

                    </tr>

                </thead>

                <tbody>

                    ${filasHistorial}

                </tbody>

            </table>

        </div>

    `;

    // ACTUALIZAR LA GRÁFICA DE EVOLUCIÓN

    dibujarGraficoEvolucion();

}


// OBTENER EL PORCENTAJE DE UN COLOR EN UNA EXTRACCIÓN

function obtenerValorEvolucion(dato, color) {

    // LOS DATOS DE EVOLUCIÓN SE GUARDAN EN MINÚSCULA

    if (dato[color] !== undefined) {
        return dato[color];
    }

    // PERMITIR TAMBIÉN NOMBRES CON MAYÚSCULA INICIAL

    const nombreColor = obtenerNombreCapitalizado(color);

    if (dato[nombreColor] !== undefined) {
        return dato[nombreColor];
    }

    return 0;

}


// CALCULAR LA DISTANCIA ENTRE UN PUNTO Y UN SEGMENTO

function calcularDistanciaSegmento(px, py, x1, y1, x2, y2) {

    const dx = x2 - x1;
    const dy = y2 - y1;

    const longitudCuadrada = dx * dx + dy * dy;

    // EVITAR DIVISIONES ENTRE CERO

    if (longitudCuadrada === 0) {

        return Math.hypot(px - x1, py - y1);

    }

    // ENCONTRAR EL PUNTO MÁS CERCANO DEL SEGMENTO

    let posicion = (
        (px - x1) * dx + (py - y1) * dy
    ) / longitudCuadrada;

    posicion = Math.max(0, Math.min(1, posicion));

    const puntoX = x1 + posicion * dx;
    const puntoY = y1 + posicion * dy;

    return Math.hypot(px - puntoX, py - puntoY);

}


// DETECTAR QUÉ INTENTO ESTÁ MÁS CERCA DEL CURSOR

function detectarIntentoCercano(event, canvas) {

    const rectangulo = canvas.getBoundingClientRect();

    // CONVERTIR LA POSICIÓN DEL CURSOR A COORDENADAS DEL CANVAS

    const mouseX = (
        (event.clientX - rectangulo.left) *
        (canvas.width / rectangulo.width)
    );

    const mouseY = (
        (event.clientY - rectangulo.top) *
        (canvas.height / rectangulo.height)
    );

    // CONFIGURACIÓN DEL ÁREA DEL GRÁFICO

    const margenIzquierdo = 75;
    const margenDerecho = 35;
    const margenSuperior = 45;
    const margenInferior = 205;

    const anchoGrafico = canvas.width -
        margenIzquierdo - margenDerecho;

    const altoGrafico = canvas.height -
        margenSuperior - margenInferior;

    const colores = obtenerColoresEstadisticas();

    let intentoMasCercano = null;
    let distanciaMinima = 12;

    // RECORRER LOS INTENTOS

    historialEstadisticasActual.forEach((intento, indice) => {

        // COMPROBAR LAS LÍNEAS DE TODOS LOS COLORES

        colores.forEach(color => {

            for (
                let i = 0;
                i < intento.evolucion.length - 1;
                i++
            ) {

                const dato1 = intento.evolucion[i];
                const dato2 = intento.evolucion[i + 1];

                const x1 = margenIzquierdo +
                    anchoGrafico * (dato1.extraccion / TOTAL_EXTRACCIONES);

                const y1 = margenSuperior +
                    altoGrafico * (
                        1 - obtenerValorEvolucion(dato1, color) / 100
                    );

                const x2 = margenIzquierdo +
                    anchoGrafico * (dato2.extraccion / TOTAL_EXTRACCIONES);

                const y2 = margenSuperior +
                    altoGrafico * (
                        1 - obtenerValorEvolucion(dato2, color) / 100
                    );

                // MEDIR LA DISTANCIA ENTRE EL CURSOR Y LA LÍNEA

                const distancia = calcularDistanciaSegmento(
                    mouseX,
                    mouseY,
                    x1,
                    y1,
                    x2,
                    y2
                );

                if (distancia < distanciaMinima) {

                    distanciaMinima = distancia;
                    intentoMasCercano = indice;

                }

            }

        });

    });

    // DETECTAR SI EL CURSOR ESTÁ SOBRE EL NOMBRE DE UN INTENTO

    historialEstadisticasActual.forEach((intento, indice) => {

        const columna = indice % 2;
        const fila = Math.floor(indice / 2);

        const x = 360 + (columna * 290);
        const y = inicioLeyendaY + (fila * 24);

        // COMPROBAR SI EL CURSOR ESTÁ DENTRO DEL ÁREA DEL NOMBRE

        if (
            mouseX >= x - 8 &&
            mouseX <= x + 145 &&
            mouseY >= y - 15 &&
            mouseY <= y + 8
        ) {

            intentoMasCercano = indice;

        }

    });

    return intentoMasCercano;

}


// DIBUJAR LA GRÁFICA DE EVOLUCIÓN DE LOS PORCENTAJES

function dibujarGraficoEvolucion() {

    const canvas = document.querySelector("#grafico-evolucion");

    const ctx = canvas.getContext("2d");

    // DEFINIR EL TAMAÑO DEL GRÁFICO

    canvas.width = 1000;
    canvas.height = 650;

    // CONFIGURAR LOS EVENTOS DEL CURSOR UNA SOLA VEZ

    if (!canvas.dataset.hoverConfigurado) {

        canvas.dataset.hoverConfigurado = "true";

        canvas.addEventListener("mousemove", event => {

            const nuevoIntento = detectarIntentoCercano(
                event,
                canvas
            );

            // REDIBUJAR SOLO SI CAMBIÓ EL INTENTO RESALTADO

            if (nuevoIntento !== intentoResaltado) {

                intentoResaltado = nuevoIntento;

                dibujarGraficoEvolucion();

            }

        });

        canvas.addEventListener("mouseleave", () => {

            intentoResaltado = null;

            dibujarGraficoEvolucion();

        });

    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // SI TODAVÍA NO HAY INTENTOS COMPLETADOS

    if (historialEstadisticasActual.length === 0) {

        ctx.font = "18px Arial";
        ctx.fillStyle = "#527b98";
        ctx.textAlign = "center";

        ctx.fillText(
            "La gráfica aparecerá cuando completes el primer intento.",
            canvas.width / 2,
            240
        );

        return;

    }

    // CONFIGURACIÓN DEL ÁREA DEL GRÁFICO

    const margenIzquierdo = 75;
    const margenDerecho = 35;
    const margenSuperior = 45;
    const margenInferior = 205;

    const anchoGrafico = canvas.width -
        margenIzquierdo - margenDerecho;

    const altoGrafico = canvas.height -
        margenSuperior - margenInferior;

    const colores = obtenerColoresEstadisticas();

    // DIBUJAR LOS EJES Y LAS LÍNEAS HORIZONTALES

    ctx.font = "13px Arial";
    ctx.fillStyle = "#527b98";
    ctx.textAlign = "right";

    for (let porcentaje = 0; porcentaje <= 100; porcentaje += 20) {

        const y = margenSuperior +
            altoGrafico * (1 - porcentaje / 100);

        // VALORES DEL EJE VERTICAL

        ctx.fillText(
            `${porcentaje}%`,
            margenIzquierdo - 12,
            y + 4
        );

        // LÍNEAS HORIZONTALES

        ctx.beginPath();

        ctx.moveTo(margenIzquierdo, y);
        ctx.lineTo(canvas.width - margenDerecho, y);

        ctx.strokeStyle = "rgba(82, 123, 152, 0.2)";
        ctx.lineWidth = 1;

        ctx.stroke();

    }

    // DIBUJAR LOS VALORES DEL EJE HORIZONTAL

    ctx.textAlign = "center";
    ctx.fillStyle = "#527b98";

    for (
        let extraccion = 0;
        extraccion <= TOTAL_EXTRACCIONES;
        extraccion += 100
    ) {

        const x = margenIzquierdo +
            anchoGrafico * (extraccion / TOTAL_EXTRACCIONES);

        ctx.fillText(
            extraccion,
            x,
            margenSuperior + altoGrafico + 25
        );

    }

    // TÍTULOS DE LOS EJES

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#16466a";
    ctx.textAlign = "center";

    // TÍTULO DEL EJE HORIZONTAL, CERCA DE SU EJE

    ctx.fillText(
        "Cantidad de extracciones",
        margenIzquierdo + anchoGrafico / 2,
        margenSuperior + altoGrafico + 60
    );

    ctx.save();

    ctx.translate(20, margenSuperior + altoGrafico / 2);
    ctx.rotate(-Math.PI / 2);

    ctx.fillText("Porcentaje de bolas", 0, 0);

    ctx.restore();

    // DIBUJAR LOS RECORRIDOS DE CADA INTENTO

    historialEstadisticasActual.forEach((intento, indice) => {

        const colorIntento = coloresIntentos[indice];

        const destacado = intentoResaltado === indice;

        // ATENUAR LOS DEMÁS INTENTOS

        ctx.globalAlpha = intentoResaltado === null
            ? 1
            : destacado ? 1 : 0.18;

        // DIBUJAR LAS LÍNEAS DE CADA COLOR

        colores.forEach((color, indiceColor) => {

            ctx.beginPath();

            ctx.strokeStyle = colorIntento;
            ctx.lineWidth = destacado ? 4.5 : 2.5;

            ctx.setLineDash(
                estilosLineas[indiceColor] || []
            );

            intento.evolucion.forEach((dato, posicion) => {

                const x = margenIzquierdo +
                    anchoGrafico * (
                        dato.extraccion / TOTAL_EXTRACCIONES
                    );

                const y = margenSuperior +
                    altoGrafico * (
                        1 - obtenerValorEvolucion(dato, color) / 100
                    );

                if (posicion === 0) {

                    ctx.moveTo(x, y);

                } else {

                    ctx.lineTo(x, y);

                }

            });

            ctx.stroke();

        });

    });

    // RESTABLECER LA TRANSPARENCIA Y EL ESTILO

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);

    // LEYENDA DE LOS COLORES

    ctx.font = "bold 13px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#16466a";

    colores.forEach((color, indice) => {

        const y = inicioLeyendaY + (indice * 24);

        ctx.beginPath();

        ctx.moveTo(75, y - 4);
        ctx.lineTo(105, y - 4);

        ctx.strokeStyle = "#087fc1";
        ctx.lineWidth = 3;

        ctx.setLineDash(
            estilosLineas[indice] || []
        );

        ctx.stroke();

        ctx.fillText(
            `${obtenerInicialEstadistica(color)} = ${obtenerNombreColor(color)}`,
            115,
            y
        );

    });

    // NOMBRES DE LOS INTENTOS EN DOS COLUMNAS

    historialEstadisticasActual.forEach((intento, indice) => {

        const columna = indice % 2;
        const fila = Math.floor(indice / 2);

        const x = 360 + (columna * 290);
        const y = inicioLeyendaY + (fila * 24);

        const color = coloresIntentos[indice];

        const destacado = intentoResaltado === indice;

        // RESALTAR EL NOMBRE DEL INTENTO SELECCIONADO

        if (destacado) {

            ctx.globalAlpha = 1;
            ctx.fillStyle = "rgba(8, 127, 193, 0.12)";

            ctx.fillRect(
                x - 8,
                y - 15,
                155,
                23
            );

        }

        // MOSTRAR UNA PEQUEÑA LÍNEA CON EL COLOR DEL INTENTO

        ctx.beginPath();

        ctx.moveTo(x, y - 4);
        ctx.lineTo(x + 20, y - 4);

        ctx.strokeStyle = color;
        ctx.lineWidth = destacado ? 4 : 3;
        ctx.setLineDash([]);

        ctx.stroke();

        // MOSTRAR EL NOMBRE DEL INTENTO

        ctx.globalAlpha = intentoResaltado === null
            ? 1
            : destacado ? 1 : 0.3;

        ctx.font = destacado
            ? "bold 14px Arial"
            : "13px Arial";

        ctx.fillStyle = destacado ? color : "#16466a";

        ctx.fillText(
            `Intento ${intento.intento}`,
            x + 28,
            y
        );

    });

    // RESTABLECER EL ESTILO

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);

}


// MOSTRAR LAS ESTADÍSTICAS AL CARGAR LA PÁGINA

mostrarEstadisticas();