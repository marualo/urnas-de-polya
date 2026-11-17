// CONTENEDOR PRINCIPAL DE LAS REFLEXIONES
const contenedorReflexiones = document.querySelector(
    "#reflexiones-contenido"
);


// MOSTRAR LAS REFLEXIONES EN PANTALLA
function mostrarReflexiones() {

    contenedorReflexiones.innerHTML = `

        <!-- 01. PREGUNTAS PARA REFLEXIONAR -->
        <div class="reflexion-bloque">

            <h3>01. Preguntas que nos hicimos</h3>

            <article class="reflexion-tarjeta">

                <h4>¿Qué sucede cuando hacemos muchas extracciones?</h4>

                <p>
                    Al principio, cuando tenemos pocas bolas,
                    cada extracción puede cambiar bastante las probabilidades.
                </p>

                <p>
                    Pero a medida que repetimos el experimento,
                    la urna va acumulando cada vez más bolas.
                    Entonces, agregar una bola más empieza a producir
                    un cambio cada vez más pequeño en los porcentajes.
                </p>

                <p>
                    Por ejemplo, si tenemos pocas bolas, agregar una negra
                    puede cambiar mucho la proporción. Pero si ya tenemos
                    mil bolas, agregar una más casi no modifica el porcentaje.
                </p>

                <p>
                    Por eso, cuando hacemos muchas extracciones,
                    las proporciones de los colores tienden a estabilizarse.
                    Esto quiere decir que los porcentajes llegan a un punto
                    en el que cambian muy poco.
                </p>

            </article>


            <article class="reflexion-tarjeta">

                <h4>¿Podemos predecir el resultado a largo plazo?</h4>

                <p>
                    No podemos conocer exactamente el resultado final,
                    pero sí podemos entender cómo se comporta el experimento.
                </p>

                <p>
                    Aunque las proporciones tienden a estabilizarse,
                    no sabemos cuál será el porcentaje final.
                </p>

                <p>
                    Por ejemplo, una vez que hacemos muchas extracciones,
                    podemos terminar con un 70 % de bolas negras y un 30 %
                    de blancas.
                </p>

                <p>
                    Pero si volvemos a realizar el experimento desde el principio,
                    podemos obtener un 40 % de negras y un 60 % de blancas.
                </p>

                <p>
                    Esto sucede porque el resultado depende de lo que ocurra
                    durante las primeras extracciones. Si al principio salen
                    más negras, ese color empieza a tener ventaja. Si salen
                    más blancas, sucede lo contrario.
                </p>

                <p>
                    Entonces, aunque todos los experimentos comiencen con
                    una bola de cada color, pueden terminar con resultados
                    diferentes.
                </p>

                <p>
                    Lo importante es entender que las proporciones se
                    estabilizan, pero no necesariamente llegan a un 50 % y 50 %,
                    ni podemos saber de antemano cuál será el resultado.
                </p>

            </article>

        </div>


        <!-- 02. EJEMPLOS DE LA VIDA COTIDIANA -->
        <div class="reflexion-bloque">

            <h3>02. El azar en nuestra vida cotidiana</h3>

            <p>
                Este experimento también se puede relacionar
                con situaciones que vemos todos los días.
            </p>

            <article class="reflexion-tarjeta">

                <h4>Las redes sociales</h4>

                <p>
                    Imaginemos que se publican dos videos.
                    Uno empieza a recibir más visitas que el otro.
                </p>

                <p>
                    Al tener más visitas, puede aparecer recomendado
                    a más personas y seguir aumentando sus reproducciones.
                </p>

                <p>
                    Así, el video que al principio tuvo una pequeña ventaja
                    puede terminar siendo mucho más popular.
                </p>

            </article>


            <article class="reflexion-tarjeta">

                <h4>Los restaurantes</h4>

                <p>
                    Imaginemos que tenemos dos restaurantes y uno empieza
                    a recibir más clientes.
                </p>

                <p>
                    Las personas que pasan por el lugar pueden verlo lleno
                    y pensar que es mejor que el otro. Entonces deciden
                    entrar también.
                </p>

                <p>
                    De esta manera, el restaurante que empezó teniendo
                    más clientes puede seguir atrayendo a otros.
                </p>

            </article>

            <p class="reflexion-aclaracion">
                Estos ejemplos no funcionan exactamente igual que la urna,
                porque también intervienen otros factores, pero muestran
                una idea parecida: lo que sucede antes puede influir
                en las decisiones futuras.
            </p>

        </div>


        <!-- 03. CONCLUSIÓN -->
        <div class="reflexion-bloque reflexion-final">

            <h3>03. Conclusión</h3>

            <article class="reflexion-conclusion">

                <!-- BURBUJAS DECORATIVAS DENTRO DE LA TARJETA -->
                <div class="burbujas-conclusion" aria-hidden="true">

                    <span class="burbuja-conclusion burbuja-c1"></span>
                    <span class="burbuja-conclusion burbuja-c2"></span>
                    <span class="burbuja-conclusion burbuja-c3"></span>
                    <span class="burbuja-conclusion burbuja-c4"></span>

                </div>

                <img
                    src="img/catconclusion.png"
                    alt="Ilustración relacionada con el azar y las urnas de Pólya"
                    class="imagen-conclusion"
                >

                <p>
                    Para finalizar, podemos decir que el azar no siempre
                    funciona de manera independiente.
                </p>

                <p>
                    En este experimento, cada extracción modifica las
                    posibilidades de las siguientes. Por eso, lo que sucede
                    al principio puede influir mucho en el resultado final.
                </p>

                <p>
                    Cuando hacemos muchas extracciones, las proporciones
                    de los colores tienden a estabilizarse, pero no podemos
                    saber exactamente en qué porcentaje lo harán.
                </p>

                <p>
                    En conclusión, este problema nos enseña que pequeñas
                    diferencias que aparecen por casualidad pueden aumentar
                    con el tiempo y producir resultados muy diferentes,
                    incluso cuando todos los experimentos comienzan
                    en las mismas condiciones.
                </p>

            </article>

        </div>

    `;

}


// MOSTRAR LAS REFLEXIONES AL CARGAR LA PÁGINA
mostrarReflexiones();