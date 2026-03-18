const botones = document.querySelectorAll('.animal-btn');

const titulo = document.getElementById('titulo');
const subtitulo = document.getElementById('subtitulo');

const cantidad = document.getElementById('cantidad');
const produccion = document.getElementById('produccion');
const precio = document.getElementById('precio');
const gastos = document.getElementById('gastos');

const resProduccion = document.getElementById('res-produccion');
const resIngresos = document.getElementById('res-ingresos');
const resGanancia = document.getElementById('res-ganancia');
const mensaje = document.getElementById('mensaje');
const resultados = document.getElementById('resultados');

let animalActual = "vaca";

const config = {
  vaca: {
    titulo: "Calculadora de Vacas",
    subtitulo: "Producción de leche",
    unidad: "litros"
  },
  cerdo: {
    titulo: "Calculadora de Cerdos",
    subtitulo: "Producción de carne",
    unidad: "kg"
  },
  gallina: {
    titulo: "Calculadora de Gallinas",
    subtitulo: "Producción de huevos",
    unidad: "huevos"
  }
};

const memoria = {
  vaca: {},
  cerdo: {},
  gallina: {}
};

botones.forEach(btn => {
  btn.addEventListener('click', () => {
    guardarDatos();

    botones.forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');

    animalActual = btn.dataset.animal;

    actualizarUI();
    cargarDatos();
  });
});

function actualizarUI() {
  titulo.textContent = config[animalActual].titulo;
  subtitulo.textContent = config[animalActual].subtitulo;
}

function guardarDatos() {
  memoria[animalActual] = {
    cantidad: cantidad.value,
    produccion: produccion.value,
    precio: precio.value,
    gastos: gastos.value,
    resProduccion: resProduccion.textContent,
    resIngresos: resIngresos.textContent,
    resGanancia: resGanancia.textContent,
    mensaje: mensaje.textContent,
    visible: resultados.style.display
  };
}

function cargarDatos() {
  const data = memoria[animalActual] || {};

  cantidad.value = data.cantidad || "";
  produccion.value = data.produccion || "";
  precio.value = data.precio || "";
  gastos.value = data.gastos || "";

  resProduccion.textContent = data.resProduccion || "--";
  resIngresos.textContent = data.resIngresos || "--";
  resGanancia.textContent = data.resGanancia || "--";
  mensaje.textContent = data.mensaje || "";

  resultados.style.display = data.visible || "none";
}

function calcular() {
  const c = parseFloat(cantidad.value);
  const p = parseFloat(produccion.value);
  const pr = parseFloat(precio.value);
  const g = parseFloat(gastos.value);

  if (isNaN(c) || isNaN(p) || isNaN(pr) || isNaN(g)) {
    alert("Completa todos los campos correctamente");
    return;
  }

  const total = c * p;
  const ingresos = total * pr;
  const ganancia = ingresos - g;

  resProduccion.textContent = total + " " + config[animalActual].unidad;
  resIngresos.textContent = "$ " + ingresos;
  resGanancia.textContent = "$ " + ganancia;

  if (ganancia >= 0) {
    mensaje.textContent = "Ganancia ✔";
    mensaje.className = "ganancia-ok";
  } else {
    mensaje.textContent = "Pérdida ✖";
    mensaje.className = "perdida";
  }

  resultados.style.display = "block";

  guardarDatos();
}

function limpiar() {
  memoria[animalActual] = {};
  cargarDatos();
}

document.getElementById('btn-calcular').addEventListener('click', calcular);
document.getElementById('btn-limpiar').addEventListener('click', limpiar);

actualizarUI();