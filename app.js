// Referencias al DOM
const inputVacas   = document.getElementById('vacas');
const inputLitros  = document.getElementById('litros');
const inputPrecio  = document.getElementById('precio');
const inputGastos  = document.getElementById('gastos');

const btnCalcular  = document.getElementById('btn-calcular');
const btnLimpiar   = document.getElementById('btn-limpiar');

const secResultados    = document.getElementById('resultados');
const resProduccion    = document.getElementById('res-produccion');
const resIngresos      = document.getElementById('res-ingresos');
const resGanancia      = document.getElementById('res-ganancia');
const mensajeResultado = document.getElementById('mensaje-resultado');

// Formato de número colombiano
function formatearNumero(n) {
  return n.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

// Validar campos
function validarCampos(vacas, litros, precio, gastos) {
  return [vacas, litros, precio, gastos].every(val => !isNaN(val) && val >= 0);
}

// Funcion principal
function calcular() {
  const vacas  = parseFloat(inputVacas.value);
  const litros = parseFloat(inputLitros.value);
  const precio = parseFloat(inputPrecio.value);
  const gastos = parseFloat(inputGastos.value);

  if (!validarCampos(vacas, litros, precio, gastos)) {
    alert('Por favor completa todos los campos con valores validos.');
    return;
  }

  const produccionTotal = vacas * litros;
  const ingresosBrutos  = produccionTotal * precio;
  const gananciaNeta    = ingresosBrutos - gastos;

  resProduccion.textContent = formatearNumero(produccionTotal) + ' L';
  resIngresos.textContent   = '$ ' + formatearNumero(ingresosBrutos);
  resGanancia.textContent   = '$ ' + formatearNumero(gananciaNeta);

  if (gananciaNeta >= 0) {
    resGanancia.classList.remove('negativo');
    mensajeResultado.className   = 'alerta ganancia';
    mensajeResultado.textContent = 'Dia rentable. Ganancia neta: $ ' + formatearNumero(gananciaNeta);
  } else {
    resGanancia.classList.add('negativo');
    mensajeResultado.className   = 'alerta perdida';
    mensajeResultado.textContent = 'Dia con perdida. Los gastos superan los ingresos en: $ ' + formatearNumero(Math.abs(gananciaNeta));
  }

  secResultados.style.display = 'block';
  secResultados.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Limpiar
function limpiar() {
  inputVacas.value  = '';
  inputLitros.value = '';
  inputPrecio.value = '';
  inputGastos.value = '';

  secResultados.style.display  = 'none';
  resProduccion.textContent    = '--';
  resIngresos.textContent      = '--';
  resGanancia.textContent      = '--';
  mensajeResultado.className   = 'alerta';
  mensajeResultado.textContent = '';
  resGanancia.classList.remove('negativo');

  inputVacas.focus();
}

// Eventos
btnCalcular.addEventListener('click', calcular);
btnLimpiar.addEventListener('click', limpiar);

[inputVacas, inputLitros, inputPrecio, inputGastos].forEach(input => {
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calcular();
  });
});