
// VARIABLES DEL JUEGO

let intentoActual = 0;
let puntos = 0;
let empates = 0;

let experimentoActual = null;

// HISTORIAL DE LOS INTENTOS

let historialIntentos = [];

// CONTENEDOR PRINCIPAL DEL JUEGO

const contenedorJuego = document.querySelector("#juego-contenido");

// MOSTRAR LA PANTALLA INICIAL

function mostrarInicioJuego() {

    contenedorJuego.innerHTML = `

        <h3>¡Poné a prueba tu intuición!</h3>

        <p>
            Tendrás 5 oportunidades para predecir
            qué color terminará con más bolas.
        </p>

        <button id="btn-comenzar">
            Comenzar desafío
        </button>

    `;

    document.querySelector("#btn-comenzar")
        .addEventListener("click", comenzarJuego);

}

// COMENZAR UNA NUEVA PARTIDA

function comenzarJuego() {

    intentoActual = 1;
    puntos = 0;
    empates = 0;

    // REINICIAR EL HISTORIAL

    historialIntentos = [];

    // ACTUALIZAR LAS ESTADÍSTICAS

    mostrarEstadisticas();

    // COMENZAR EL PRIMER INTENTO

    mostrarIntento();

}

// GENERAR Y MOSTRAR UN INTENTO

function mostrarIntento() {

    // GENERAR UN EXPERIMENTO DE 500 EXTRACCIONES

    experimentoActual = simularExperimento(500);

    // OBTENER LAS PRIMERAS 10 EXTRACCIONES

    const primerasDiez = experimentoActual.resultados.slice(0, 10);

    // OBTENER LAS CANTIDADES DESPUÉS DE 10 EXTRACCIONES

    const cantidadesIniciales = primerasDiez[9].cantidades;

    // MOSTRAR LOS RESULTADOS

    contenedorJuego.innerHTML = `

        <h3>Intento ${intentoActual} de 5</h3>

        <p>
            Puntos: ${puntos} | Empates: ${empates}
        </p>

        <h4>Primeras 10 extracciones</h4>

        <div class="resultados-bolas">

            ${primerasDiez.map(dato => `

                <span class="bola ${dato.color.toLowerCase()}">
                    ${dato.color === "Negra" ? "N" : "B"}
                </span>

            `).join("")}

        </div>

        <h4>Composición actual de la urna</h4>

        <p>⚫ Negras: ${cantidadesIniciales.Negra}</p>

        <p>⚪ Blancas: ${cantidadesIniciales.Blanca}</p>

        <h3>
            ¿Qué color tendrá más bolas al llegar a las 500 extracciones?
        </h3>

        <p>Elegí tu predicción:</p>

        <button class="btn-prediccion" data-color="Negra">
            ⚫ Negras
        </button>

        <button class="btn-prediccion" data-color="Blanca">
            ⚪ Blancas
        </button>

        <div id="resultado-intento" hidden></div>

    `;

    // ESCUCHAR LA ELECCIÓN DEL JUGADOR

    document.querySelectorAll(".btn-prediccion")
        .forEach(boton => {

            boton.addEventListener("click", function () {

                const prediccion = this.dataset.color;

                resolverIntento(prediccion);

            });

        });

}

// COMPARAR LA PREDICCIÓN CON EL RESULTADO FINAL

function resolverIntento(prediccion) {

    // OBTENER LAS CANTIDADES FINALES

    const resultadoFinal = experimentoActual.urnaFinal;

    const negras = resultadoFinal.Negra;
    const blancas = resultadoFinal.Blanca;

    // DETERMINAR QUÉ COLOR GANÓ

    let ganador;

    if (negras > blancas) {

        ganador = "Negra";

    } else if (blancas > negras) {

        ganador = "Blanca";

    } else {

        ganador = "Empate";

    }

    // COMPARAR LA PREDICCIÓN CON EL RESULTADO

    let mensaje;
    let claseResultado;

    if (ganador === "Empate") {

        mensaje = "¡Hubo un empate! No se suma ningún punto.";

        claseResultado = "resultado-empate";

        empates++;

    } else if (prediccion === ganador) {

        mensaje = "¡Correcto! Acertaste la predicción.";

        claseResultado = "resultado-correcto";

        puntos++;

    } else {

        mensaje = "Esta vez no acertaste. ¡A seguir intentando!";

        claseResultado = "resultado-incorrecto";

    }

    // GUARDAR LOS RESULTADOS DEL INTENTO

    historialIntentos.push({

        intento: intentoActual,

        prediccion: prediccion,

        ganador: ganador,

        negras: negras,

        blancas: blancas,

        porcentajeNegra: experimentoActual.porcentajesFinales.Negra,

        porcentajeBlanca: experimentoActual.porcentajesFinales.Blanca,

        // GUARDAR LOS PORCENTAJES DE LAS 500 EXTRACCIONES

        evolucion: experimentoActual.resultados.map(dato => ({

            extraccion: dato.extraccion,

            negra: dato.porcentajes.Negra,

            blanca: dato.porcentajes.Blanca

        }))

    });

    // ACTUALIZAR LAS ESTADÍSTICAS Y LA GRÁFICA

    mostrarEstadisticas();

    // DESACTIVAR LOS BOTONES PARA EVITAR OTRA PREDICCIÓN

    document.querySelectorAll(".btn-prediccion")
        .forEach(boton => boton.disabled = true);

    // MOSTRAR EL RESULTADO FINAL

    const cajaResultado = document.querySelector("#resultado-intento");

    cajaResultado.hidden = false;

    cajaResultado.classList.add(claseResultado);

    cajaResultado.innerHTML = `

        <h3>${mensaje}</h3>

        <h4>Resultado después de 500 extracciones</h4>

        <p>⚫ Negras: ${negras}</p>

        <p>⚪ Blancas: ${blancas}</p>

        <p>
            Porcentaje de negras:
            ${experimentoActual.porcentajesFinales.Negra.toFixed(2)} %
        </p>

        <p>
            Porcentaje de blancas:
            ${experimentoActual.porcentajesFinales.Blanca.toFixed(2)} %
        </p>

        <h4>Predicción: ${prediccion}</h4>

        <h4>Resultado: ${ganador}</h4>

        <details>

            <summary>Ver las 490 extracciones restantes</summary>

            <div class="resultados-bolas">

                ${experimentoActual.resultados.slice(10).map(dato => `

                    <span class="bola ${dato.color.toLowerCase()}">
                        ${dato.color === "Negra" ? "N" : "B"}
                    </span>

                `).join("")}

            </div>

        </details>

        <button id="btn-siguiente">

            ${intentoActual < 5
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

    // PASAR AL SIGUIENTE INTENTO O MOSTRAR EL RESUMEN

    document.querySelector("#btn-siguiente")
        .addEventListener("click", function () {

            if (intentoActual < 5) {

                intentoActual++;

                mostrarIntento();

                // VOLVER AUTOMÁTICAMENTE AL JUEGO

                contenedorJuego.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            } else {

                mostrarResumen();

                // CENTRAR EL RESUMEN EN LA PANTALLA

                contenedorJuego.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        });

}

// MOSTRAR EL RESUMEN DE LA PARTIDA

function mostrarResumen() {

    contenedorJuego.innerHTML = `

        <h3>¡Desafío terminado!</h3>

        <h4>Resultados de la partida</h4>

        <p>Intentos realizados: 5</p>

        <p>Respuestas correctas: ${puntos}</p>

        <p>Empates: ${empates}</p>

        <p>Respuestas incorrectas: ${5 - puntos - empates}</p>

        <h2>Tu puntaje: ${puntos} / 5</h2>

        <a href="#estadisticas" class="boton-estadisticas">
            Ver estadísticas ↓
        </a>

        <button id="btn-reiniciar">
            Volver a jugar
        </button>

    `;

    document.querySelector("#btn-reiniciar")
        .addEventListener("click", comenzarJuego);

}

// MOSTRAR LA PANTALLA INICIAL AL CARGAR LA PÁGINA

mostrarInicioJuego();