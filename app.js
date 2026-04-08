// ============================================================
// CONFIGURACIÓN Y PERSISTENCIA - PORTAL RURAL EL PROGRESO
// ============================================================

const USERS = [
  { username: "admin", password: "1234" },
  { username: "juan", password: "ganadero" }
];

const loginContainer = document.getElementById("login-container");
const appContainer = document.getElementById("app-container");
const loginBtn = document.getElementById("btn-login");
const logoutBtn = document.getElementById("btn-logout");
const errorMsg = document.getElementById("error-msg");

// --- ELEMENTOS DE LA CALCULADORA ---
const botones = document.querySelectorAll('.animal-btn');
const titulo = document.getElementById('titulo');
const subtitulo = document.getElementById('subtitulo');
const resProd = document.getElementById('res-produccion');
const resIng = document.getElementById('res-ingresos');
const resGan = document.getElementById('res-ganancia');
const mensaje = document.getElementById('mensaje');
const tarjetaResultados = document.getElementById('resultados');

// Inputs
const inputCant = document.getElementById('cantidad');
const inputProd = document.getElementById('produccion');
const inputPrec = document.getElementById('precio');
const inputGast = document.getElementById('gastos');

let animalActual = "vaca";

const config = {
  vaca: { titulo: "Gestión de Vacas", subtitulo: "Producción de leche", unidad: "litros" },
  cerdo: { titulo: "Gestión de Cerdos", subtitulo: "Producción de carne", unidad: "kg" },
  gallina: { titulo: "Gestión de Gallinas", subtitulo: "Producción de huevos", unidad: "unidades" },
  oveja: { titulo: "Gestión de Ovejas", subtitulo: "Producción de lana o carne", unidad: "kg" },
  cabra: { titulo: "Gestión de Cabras", subtitulo: "Producción de leche", unidad: "litros" },
  pez: { titulo: "Gestión de Peces (Piscicultura)", subtitulo: "Producción de biomasa", unidad: "kg" }
};

// 1. CARGAR MEMORIA INICIAL
let memoria = JSON.parse(sessionStorage.getItem("memoriaGanadera")) || {
  vaca: {}, cerdo: {}, gallina: {}, oveja: {}, cabra: {}, pez: {}
};

// --- GESTIÓN DE SESIÓN ---
window.onload = () => {
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    cargarDatos(); // Cargar datos del animal por defecto (vaca)
  }
};

loginBtn.addEventListener("click", () => {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (USERS.find(user => user.username === u && user.password === p)) {
    sessionStorage.setItem("isLoggedIn", "true");
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    cargarDatos();
  } else {
    errorMsg.style.display = "block";
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("memoriaGanadera");
  window.location.reload();
});

// --- LÓGICA DE PERSISTENCIA POR ANIMAL ---

function guardarEstadoActual() {
  memoria[animalActual] = {
    cantidad: inputCant.value,
    produccion: inputProd.value,
    precio: inputPrec.value,
    gastos: inputGast.value,
    // Guardar el estado del cálculo
    htmlProd: resProd.innerHTML,
    htmlIng: resIng.innerHTML,
    htmlGan: resGan.innerHTML,
    textoMensaje: mensaje.innerText,
    claseMensaje: mensaje.className,
    visibleResultados: tarjetaResultados.style.display
  };
  sessionStorage.setItem("memoriaGanadera", JSON.stringify(memoria));
}

function cargarDatos() {
  const data = memoria[animalActual] || {};
  
  // Restaurar valores de inputs
  inputCant.value = data.cantidad || "";
  inputProd.value = data.produccion || "";
  inputPrec.value = data.precio || "";
  inputGast.value = data.gastos || "";

  // Restaurar etiquetas de resultados
  resProd.innerHTML = data.htmlProd || "--";
  resIng.innerHTML = data.htmlIng || "--";
  resGan.innerHTML = data.htmlGan || "--";
  mensaje.innerText = data.textoMensaje || "";
  mensaje.className = data.claseMensaje || "";
  
  // Restaurar visibilidad de la tarjeta
  tarjetaResultados.style.display = data.visibleResultados || "none";
  
  // Actualizar Títulos
  titulo.textContent = config[animalActual].titulo;
  subtitulo.textContent = config[animalActual].subtitulo;
}

// Eventos de botones de animales
botones.forEach(btn => {
  btn.addEventListener('click', () => {
    guardarEstadoActual(); // Guardar lo que hay antes de cambiar
    
    botones.forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    
    animalActual = btn.dataset.animal;
    cargarDatos(); // Cargar lo guardado del nuevo animal
  });
});

// --- OPERACIÓN MATEMÁTICA ---

function calcular() {
  const c = parseFloat(inputCant.value);
  const p = parseFloat(inputProd.value);
  const pr = parseFloat(inputPrec.value);
  const g = parseFloat(inputGast.value);

  if ([c, p, pr, g].some(val => isNaN(val) || val < 0)) {
    alert("Por favor, ingrese valores numéricos válidos y positivos.");
    return;
  }

  const total = c * p;
  const ingresos = total * pr;
  const ganancia = ingresos - g;

  const f = new Intl.NumberFormat('es-CO');

  resProd.innerHTML = `<strong>${f.format(total.toFixed(2))}</strong> ${config[animalActual].unidad}`;
  resIng.innerHTML = `<strong>$ ${f.format(ingresos.toFixed(2))}</strong>`;
  resGan.innerHTML = `<strong>$ ${f.format(ganancia.toFixed(2))}</strong>`;

  if (ganancia >= 0) {
    mensaje.innerText = "RESULTADO: GANANCIA ✔";
    mensaje.className = "ganancia-ok";
  } else {
    mensaje.innerText = "RESULTADO: PÉRDIDA ✖";
    mensaje.className = "perdida";
  }

  tarjetaResultados.style.display = "block";
  
  guardarEstadoActual(); // Guardar automáticamente tras calcular
  tarjetaResultados.scrollIntoView({ behavior: 'smooth' });
}

function limpiar() {
  memoria[animalActual] = {};
  sessionStorage.setItem("memoriaGanadera", JSON.stringify(memoria));
  cargarDatos();
}

document.getElementById('btn-calcular').addEventListener('click', calcular);
document.getElementById('btn-limpiar').addEventListener('click', limpiar);