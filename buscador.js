let datos=[];
let visibles=20;

const normalizar=t=>(t||"").toString().toLowerCase()
.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();

fetch("./peregrinos_milagro_2026.json")
.then(r=>r.json())
.then(json=>{
datos=json.map(x=>({...x,_texto:normalizar(JSON.stringify(x))}));
cargarFiltros();
buscarDatos();
})
.catch(e=>console.error(e));

function cargarFiltros(){
let mods=[...new Set(datos.map(x=>x.modalidad).filter(Boolean))];
mods.forEach(x=>modalidad.innerHTML+=`<option>${x}</option>`);

let fechas=[...new Set(datos.map(x=>x.fecha).filter(Boolean))];
fechas.forEach(x=>fecha.innerHTML+=`<option>${x}</option>`);
}

const buscar=document.getElementById("buscar");
const modalidad=document.getElementById("modalidad");
const fecha=document.getElementById("fecha");
const contador=document.getElementById("contador");
const resultados=document.getElementById("resultados");
const mas=document.getElementById("mas");

buscar.addEventListener("input",()=>{visibles=20;buscarDatos()});
modalidad.addEventListener("change",buscarDatos);
fecha.addEventListener("change",buscarDatos);
mas.addEventListener("click",()=>{visibles+=20;buscarDatos()});

function buscarDatos(){
let q=normalizar(buscar.value);

let lista=datos.filter(x=>{
let coincide=!q || q.split(" ").every(p=>x._texto.includes(p));
let m=!modalidad.value || x.modalidad===modalidad.value;
let f=!fecha.value || x.fecha===fecha.value;
return coincide&&m&&f;
});

contador.innerHTML=q ? lista.length+" resultados encontrados" : "Mostrando todas las peregrinaciones";

mostrar(lista.slice(0,visibles));
mas.style.display=lista.length>visibles?"block":"none";
}

function mostrar(lista){
resultados.innerHTML=lista.map(x=>`
<div class="card">
<div class="nombre">🚶 ${x.nombre||""}</div>
<div class="dato">📍 ${x.origen||""} ${x.provincia||""}</div>
<div class="dato">🗓 Llegada: ${x.fecha||""}</div>
<div class="dato">⏰ Hora: ${x.hora||""}</div>
<div class="dato">👥 Peregrinos: ${x.cantidad||""}</div>
<div class="dato">🚶 Modalidad: ${x.modalidad||""}</div>
</div>`).join("");
}
