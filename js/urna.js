// CREAR UNA URNA CON LAS CANTIDADES INICIALES
function crearUrna(negra = 1, blanca = 1, roja = 0) {

    return {
        Negra: negra,
        Blanca: blanca,
        Roja: roja
    };

}

// REALIZAR UNA EXTRACCIÓN
function extraerBola(urna, regla = "mismo") {

    // Calculamos la cantidad total de bolas
    const total = Object.values(urna)
        .reduce((suma, cantidad) => suma + cantidad, 0);

    // Elegimos un número al azar
    const numero = Math.floor(Math.random() * total) + 1;

    // Identificamos el color extraído
    let acumulado = 0;
    let colorExtraido;

    for (const color in urna) {

        acumulado += urna[color];

        if (numero <= acumulado) {
            colorExtraido = color;
            break;
        }

    }

    // Determinamos qué color agregamos
    let colorAgregado = colorExtraido;

    if (regla === "contrario") {

        const coloresContrarios = {
            Negra: "Blanca",
            Blanca: "Negra"
        };

        colorAgregado = coloresContrarios[colorExtraido];

        if (!colorAgregado) {
            throw new Error("La regla contrario requiere dos colores.");
        }

    }

    // Agregamos una bola del color correspondiente
    urna[colorAgregado]++;

    // Devolvemos la información de la extracción
    return {
        extraido: colorExtraido,
        agregado: colorAgregado,
        cantidades: { ...urna }
    };

}

// CALCULAR LOS PORCENTAJES DE CADA COLOR
function calcularPorcentajes(urna) {

    // Calculamos la cantidad total
    const total = Object.values(urna)
        .reduce((suma, cantidad) => suma + cantidad, 0);

    const porcentajes = {};

    // Calculamos el porcentaje de cada color
    for (const color in urna) {

        porcentajes[color] =
            (urna[color] / total) * 100;

    }

    return porcentajes;

}

// SIMULAR UN EXPERIMENTO COMPLETO
function simularExperimento(
    cantidadExtracciones = 500,
    urnaInicial = crearUrna(),
    regla = "mismo"
) {

    // Creamos una copia de la urna inicial
    const urna = { ...urnaInicial };

    // Lista para guardar los resultados
    const resultados = [];

    // Realizamos las extracciones
    for (let i = 0; i < cantidadExtracciones; i++) {

        const resultado = extraerBola(urna, regla);

        resultados.push({

            extraccion: i + 1,
            color: resultado.extraido,
            cantidades: resultado.cantidades,
            porcentajes: calcularPorcentajes(urna)

        });

    }

    // Devolvemos todos los datos del experimento
    return {
        resultados: resultados,
        urnaFinal: urna,
        porcentajesFinales: calcularPorcentajes(urna)
    };

}