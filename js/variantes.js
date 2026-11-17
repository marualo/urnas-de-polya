// ESTADO DE LAS PARTIDAS DE CADA VARIANTE

const partidasVariantes = {
    tresColores: null,
    contrario: null,
    iniciales: null
};

// CANTIDAD DE EXTRACCIONES DE CADA INTENTO

const TOTAL_EXTRACCIONES_VARIANTES = 500;

// MOSTRAR LAS VARIANTES DEL EXPERIMENTO

function mostrarVariantes() {

    const contenedor = document.querySelector("#variantes-contenido");

    contenedor.innerHTML = `

        <!-- VARIANTE 1: TRES COLORES -->
        <div class="variante">

            <h3>Experimento 1: Agregar un tercer color</h3>

            <p>
                Comenzamos con una bola negra, una blanca
                y una roja. Se agrega una bola del mismo
                color que sale en cada extracción.
            </p>

            <button id="btn-tres-colores" class="btn-variante">
                Comenzar partida
            </button>

            <div id="resultado-tres-colores"
                 class="resultado-variante"
                 hidden></div>

        </div>


        <!-- VARIANTE 2: COLOR CONTRARIO -->
        <div class="variante">

            <h3>Experimento 2: Agregar el color contrario</h3>

            <p>
                Cuando sale una bola negra, agregamos una blanca.
                Cuando sale una blanca, agregamos una negra.
            </p>

            <button id="btn-contrario" class="btn-variante">
                Comenzar partida
            </button>

            <div id="resultado-contrario"
                 class="resultado-variante"
                 hidden></div>

        </div>


        <!-- VARIANTE 3: CANTIDADES INICIALES -->
        <div class="variante">

            <h3>Experimento 3: Cambiar las cantidades iniciales</h3>

            <p>
                Probamos cómo influye comenzar con una bola
                extra de uno de los dos colores.
            </p>

            <button id="btn-negra-extra" class="btn-variante">
                Comenzar con una negra extra
            </button>

            <button id="btn-blanca-extra" class="btn-variante">
                Comenzar con una blanca extra
            </button>

            <div id="resultado-iniciales"
                 class="resultado-variante"
                 hidden></div>

        </div>

    `;

    // CONECTAR LOS BOTONES CON SUS PARTIDAS

    document.querySelector("#btn-tres-colores")
        .addEventListener("click", function () {

            iniciarPartidaVariante(
                "tresColores",
                "resultado-tres-colores",
                crearUrna(1, 1, 1),
                "mismo"
            );

        });


    document.querySelector("#btn-contrario")
        .addEventListener("click", function () {

            iniciarPartidaVariante(
                "contrario",
                "resultado-contrario",
                crearUrna(1, 1),
                "contrario"
            );

        });


    document.querySelector("#btn-negra-extra")
        .addEventListener("click", function () {

            iniciarPartidaVariante(
                "iniciales",
                "resultado-iniciales",
                crearUrna(2, 1),
                "mismo",
                "Una bola negra extra"
            );

        });


    document.querySelector("#btn-blanca-extra")
        .addEventListener("click", function () {

            iniciarPartidaVariante(
                "iniciales",
                "resultado-iniciales",
                crearUrna(1, 2),
                "mismo",
                "Una bola blanca extra"
            );

        });

}

// INICIAR UNA PARTIDA DE UNA VARIANTE

function iniciarPartidaVariante(
    clave,
    contenedorId,
    urnaInicial,
    regla,
    descripcion = ""
) {

    // GUARDAR LA CONFIGURACIÓN DE ESTA PARTIDA

    partidasVariantes[clave] = {

        contenedorId: contenedorId,
        urnaInicial: { ...urnaInicial },
        regla: regla,
        descripcion: descripcion,

        intento: 1,
        puntos: 0,
        empates: 0,
        historial: [],
        experimento: null

    };

    // MOSTRAR EL CONTENEDOR DE LA PARTIDA

    const contenedor = document.querySelector(
        `#${contenedorId}`
    );

    contenedor.hidden = false;

    // MOSTRAR EL PRIMER INTENTO

    mostrarIntentoVariante(clave);

}

// MOSTRAR UN INTENTO DE LA PARTIDA

function mostrarIntentoVariante(clave) {

    const partida = partidasVariantes[clave];


    // GENERAR UN EXPERIMENTO DE 500 EXTRACCIONES

    partida.experimento = simularExperimento(
        TOTAL_EXTRACCIONES_VARIANTES,
        partida.urnaInicial,
        partida.regla
    );

    // OBTENER LAS PRIMERAS 10 EXTRACCIONES

    const primerasDiez = partida.experimento.resultados
        .slice(0, 10);

    // CANTIDADES DESPUÉS DE LAS PRIMERAS 10 EXTRACCIONES

    const cantidadesIniciales = primerasDiez[9].cantidades;

    // IDENTIFICAR LOS COLORES DISPONIBLES

    const colores = Object.keys(partida.urnaInicial)
        .filter(color => partida.urnaInicial[color] > 0);


    const contenedor = document.querySelector(
        `#${partida.contenedorId}`
    );

    // MOSTRAR EL INTENTO Y LAS OPCIONES DE PREDICCIÓN

    contenedor.innerHTML = `

        <h4>
            Intento ${partida.intento} de 5
        </h4>

        <p>
            Puntos: ${partida.puntos}
            |
            Empates: ${partida.empates}
        </p>

        ${partida.descripcion
            ? `<p>${partida.descripcion}</p>`
            : ""
        }

        <h4>Primeras 10 extracciones</h4>

        <div class="resultados-bolas">

            ${primerasDiez.map(dato => `

                <span class="bola ${dato.color.toLowerCase()}">
                    ${obtenerInicial(dato.color)}
                </span>

            `).join("")}

        </div>

        <h4>Composición actual de la urna</h4>

        ${colores.map(color => `

            <p>
                ${obtenerEmoji(color)}
                ${color}: ${cantidadesIniciales[color]}
            </p>

        `).join("")}

        <h4 id="pregunta-variante-${clave}">
            ¿Qué color tendrá más bolas después de
            las 500 extracciones?
        </h4>

        <p>Elegí tu predicción:</p>

        <div class="opciones-prediccion-variante">

            ${colores.map(color => `

                <button
                    class="btn-prediccion"
                    data-color="${color}"
                    data-variante="${clave}"
                >
                    ${obtenerEmoji(color)} ${color}
                </button>

            `).join("")}

        </div>

        <div id="resultado-intento-${clave}"></div>

    `;

    // CONECTAR LOS BOTONES DE PREDICCIÓN

    contenedor.querySelectorAll(".btn-prediccion")
        .forEach(boton => {

            boton.addEventListener("click", function () {

                const prediccion = this.dataset.color;

                resolverIntentoVariante(clave, prediccion);

            });

        });

}

// GENERAR LA EVOLUCIÓN DE LOS PORCENTAJES

function generarEvolucionVariante(experimento, colores) {

    return experimento.resultados.map((dato, indice) => {

        const cantidades = dato.cantidades;

        // SUMAR LAS BOLAS DE TODOS LOS COLORES ACTIVOS

        const totalBolas = colores.reduce(
            (suma, color) => suma + cantidades[color],
            0
        );

        // GUARDAR EL PORCENTAJE DE CADA COLOR

        const evolucion = {

            extraccion: indice + 1

        };

        colores.forEach(color => {

            const propiedad = color.toLowerCase();

            evolucion[propiedad] = totalBolas > 0
                ? (cantidades[color] / totalBolas) * 100
                : 0;

        });

        return evolucion;

    });

}

// COMPARAR LA PREDICCIÓN CON EL RESULTADO FINAL

function resolverIntentoVariante(clave, prediccion) {

    const partida = partidasVariantes[clave];

    const experimento = partida.experimento;

    const urnaFinal = experimento.urnaFinal;

    // BUSCAR LA CANTIDAD MÁXIMA DE BOLAS

    const cantidadMaxima = Math.max(
        ...Object.values(urnaFinal)
    );

    // IDENTIFICAR LOS COLORES QUE ALCANZARON ESE MÁXIMO

    const ganadores = Object.keys(urnaFinal)
        .filter(color => urnaFinal[color] === cantidadMaxima);


    let mensaje;
    let claseResultado;
    let ganador;

    // COMPROBAR SI HUBO EMPATE

    if (ganadores.length > 1) {

        ganador = "Empate";

        mensaje = "¡Hubo un empate! No se suma ningún punto.";

        claseResultado = "resultado-variante-empate";

        partida.empates++;

    }

    // COMPROBAR SI LA PREDICCIÓN FUE CORRECTA

    else if (prediccion === ganadores[0]) {

        ganador = ganadores[0];

        mensaje = "¡Correcto! Acertaste la predicción.";

        claseResultado = "resultado-variante-correcto";

        partida.puntos++;

    }

    // SI LA PREDICCIÓN FUE INCORRECTA

    else {

        ganador = ganadores[0];

        mensaje = "Esta vez no acertaste. ¡A seguir intentando!";

        claseResultado = "resultado-variante-incorrecto";

    }

    // IDENTIFICAR LOS COLORES ACTIVOS

    const colores = Object.keys(partida.urnaInicial)
        .filter(color => partida.urnaInicial[color] > 0);

    // GENERAR LA EVOLUCIÓN DE LOS PORCENTAJES

    const evolucion = generarEvolucionVariante(
        experimento,
        colores
    );

    // GUARDAR EL RESULTADO COMPLETO DEL INTENTO

    partida.historial.push({

        intento: partida.intento,
        prediccion: prediccion,
        ganador: ganador,

        cantidades: { ...urnaFinal },

        evolucion: evolucion

    });

    // DESACTIVAR LOS BOTONES DE PREDICCIÓN

    const contenedor = document.querySelector(
        `#${partida.contenedorId}`
    );

    contenedor.querySelectorAll(".btn-prediccion")
        .forEach(boton => boton.disabled = true);

    // GENERAR LOS RESULTADOS FINALES

    let resultados = "";

    for (const color of colores) {

        resultados += `

            <p>
                ${obtenerEmoji(color)} ${color}:
                ${urnaFinal[color]} bolas
                (${experimento.porcentajesFinales[color].toFixed(2)} %)
            </p>

        `;

    }

    // MOSTRAR LOS RESULTADOS

    const cajaResultado = document.querySelector(
        `#resultado-intento-${clave}`
    );

    cajaResultado.classList.add(claseResultado);

    cajaResultado.innerHTML = `

        <h3>${mensaje}</h3>

        <h4>Resultado después de 500 extracciones</h4>

        ${resultados}

        <h4>Tu predicción: ${obtenerEmoji(prediccion)} ${prediccion}</h4>

        <h4>
            Resultado:
            ${ganador === "Empate"
                ? "Empate"
                : obtenerEmoji(ganador) + " " + ganador
            }
        </h4>

        <details>

            <summary>Ver las 490 extracciones restantes</summary>

            <div class="resultados-bolas">

                ${experimento.resultados.slice(10).map(dato => `

                    <span class="bola ${dato.color.toLowerCase()}">
                        ${obtenerInicial(dato.color)}
                    </span>

                `).join("")}

            </div>

        </details>

        <button
            id="btn-siguiente-${clave}"
            class="btn-variante"
        >
            ${partida.intento < 5
                ? "Siguiente intento"
                : "Ver resumen"
            }
        </button>

    `;

    // DESPLAZAR LA PANTALLA HASTA EL RESULTADO

    cajaResultado.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    // CONECTAR EL BOTÓN PARA CONTINUAR

    document.querySelector(`#btn-siguiente-${clave}`)
        .addEventListener("click", function () {

            if (partida.intento < 5) {

                partida.intento++;

                mostrarIntentoVariante(clave);

                // DESPLAZAR LA PANTALLA HASTA LA NUEVA PREDICCIÓN

                document.querySelector(
                    `#pregunta-variante-${clave}`
                ).scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            } else {

                mostrarResumenVariante(clave);

            }

        });

}

// MOSTRAR EL RESUMEN DE UNA PARTIDA

function mostrarResumenVariante(clave) {

    const partida = partidasVariantes[clave];

    const incorrectas = 5 - partida.puntos - partida.empates;

    const contenedor = document.querySelector(
        `#${partida.contenedorId}`
    );

    // DETERMINAR EL NOMBRE DE LA VARIANTE

    const nombresVariantes = {
        tresColores: "Variante 1",
        contrario: "Variante 2",
        iniciales: "Variante 3"
    };

    const nombreVariante = nombresVariantes[clave];

    // MOSTRAR EL RESUMEN FINAL

    contenedor.innerHTML = `

        <div class="resumen-variante">

            <h3>¡Partida terminada!</h3>

            <h4>Resultados de los 5 intentos</h4>

            <p>Respuestas correctas: ${partida.puntos}</p>

            <p>Empates: ${partida.empates}</p>

            <p>Respuestas incorrectas: ${incorrectas}</p>

            <h2>
                Tu puntaje: ${partida.puntos} / 5
            </h2>

            <a
                href="#estadisticas"
                id="btn-estadisticas-${clave}"
                class="boton-estadisticas"
            >
                Ver estadísticas ↓
            </a>

            <button
                id="btn-reiniciar-${clave}"
                class="btn-variante"
            >
                Volver a jugar
            </button>

        </div>

    `;

    // DESPLAZAR LA PANTALLA HASTA EL RESUMEN FINAL

    contenedor.querySelector(".resumen-variante")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    // CONECTAR EL BOTÓN PARA VER LAS ESTADÍSTICAS

    document.querySelector(`#btn-estadisticas-${clave}`)
        .addEventListener("click", function (event) {

            event.preventDefault();

            mostrarEstadisticasVariante(
                clave,
                nombreVariante
            );

        });

    // REINICIAR SOLAMENTE ESTA VARIANTE

    document.querySelector(`#btn-reiniciar-${clave}`)
        .addEventListener("click", function () {

            iniciarPartidaVariante(
                clave,
                partida.contenedorId,
                partida.urnaInicial,
                partida.regla,
                partida.descripcion
            );

        });

}

// OBTENER EL EMOJI SEGÚN EL COLOR

function obtenerEmoji(color) {

    const emojis = {
        Negra: "⚫",
        Blanca: "⚪",
        Roja: "🔴"
    };

    return emojis[color];

}

// OBTENER LA INICIAL DEL COLOR

function obtenerInicial(color) {

    const iniciales = {
        Negra: "N",
        Blanca: "B",
        Roja: "R"
    };

    return iniciales[color];

}

// MOSTRAR EL LABORATORIO AL CARGAR LA PÁGINA

mostrarVariantes();