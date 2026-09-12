let datos=[];
let visibles=20;

const normalizar=t=>(t||"").toString().toLowerCase()
.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();

fetch("peregrinos_milagro_2026.json")
.then(r=>r.json())
.then(json=>{
 datos=json.map(x=>({...x,_texto:normalizar(JSON.stringify(x))}));
 estado.innerHTML="🟢 Base conectada: "+datos.length+" peregrinaciones cargadas";
 cargarFiltros();
 buscar();
})
.catch(e=>{
 estado.innerHTML="🔴 Error al cargar el JSON";
 console.error(e);
});

function cargarFiltros(){
 let mods=[...new Set(datos.map(x=>x.modalidad||x.modalidad_limpia).filter(Boolean))];
 mods.forEach(x=>modalidad.innerHTML+=`<option>${x}</option>`);
 let fechas=[...new Set(datos.map(x=>x.fecha||x.fecha_llegada).filter(Boolean))];
 fechas.forEach(x=>fecha.innerHTML+=`<option>${x}</option>`);
}

buscar.addEventListener("input",()=>{visibles=20;buscarDatos()});
modalidad.addEventListener("change",buscarDatos);
fecha.addEventListener("change",buscarDatos);
mas.onclick=()=>{visibles+=20;buscarDatos()};

function buscarDatos(){
 let q=normalizar(buscar.value);
 let res=datos.filter(x=>{
 let ok=!q || q.split(" ").every(p=>x._texto.includes(p));
 let mod=!modalidad.value || (x.modalidad||x.modalidad_limpia)==modalidad.value;
 let fec=!fecha.value || (x.fecha||x.fecha_llegada)==fecha.value;
 return ok&&mod&&fec;
 });
 contador.innerHTML=res.length+" resultados encontrados";
 resultados.innerHTML=res.slice(0,visibles).map(x=>`
 <div class="card">
 <div class="nombre">🚶 ${x.nombre||x.peregrinacion||x.nombre_peregrinacion||""}</div>
 <div class="dato">📍 ${x.origen||x.localidad||""} ${x.provincia||""}</div>
 <div class="dato">🗓 Llegada: ${x.fecha||x.fecha_llegada||""}</div>
 <div class="dato">⏰ Hora: ${x.hora||x.hora_llegada||""}</div>
 <div class="dato">👥 Peregrinos: ${x.cantidad||""}</div>
 <div class="dato">🚶 Modalidad: ${x.modalidad||""}</div>
 </div>`).join("");
}
