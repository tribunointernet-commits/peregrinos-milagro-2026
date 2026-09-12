
let datos = [];
let visibles = 20;

const buscar = document.getElementById("buscar");
const modalidad = document.getElementById("modalidad");
const fecha = document.getElementById("fecha");
const contador = document.getElementById("contador");
const resultados = document.getElementById("resultados");
const mas = document.getElementById("mas");

const normalizar = t => (t || "")
.toString()
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.trim();

fetch("./peregrinos_milagro_2026.json")
.then(r => {
    if(!r.ok) throw new Error("No se encontró JSON");
    return r.json();
})
.then(json => {
    datos = json.map(x => ({
        ...x,
        _texto: normalizar(JSON.stringify(x))
    }));

    cargarFiltros();
    buscarDatos();
})
.catch(error => console.error(error));


function cargarFiltros(){

    let modalidades = [...new Set(
        datos.map(x => x.modalidad).filter(Boolean)
    )];

    modalidades.forEach(m=>{
        modalidad.innerHTML += `<option value="${m}">${m}</option>`;
    });


    let fechas = [...new Set(
        datos.map(x => x.fecha).filter(Boolean)
    )];

    fechas.forEach(f=>{
        fecha.innerHTML += `<option value="${f}">${f}</option>`;
    });
}


buscar.addEventListener("input",()=>{
    visibles=20;
    buscarDatos();
});

modalidad.addEventListener("change",()=>{
    visibles=20;
    buscarDatos();
});

fecha.addEventListener("change",()=>{
    visibles=20;
    buscarDatos();
});

mas.addEventListener("click",()=>{
    visibles += 20;
    buscarDatos();
});


function buscarDatos(){

    let texto = normalizar(buscar.value);

    let lista = datos.filter(x=>{

        let coincideTexto = !texto ||
        texto.split(" ").every(p=>x._texto.includes(p));


        let coincideModalidad =
        !modalidad.value ||
        normalizar(x.modalidad) === normalizar(modalidad.value);


        let coincideFecha =
        !fecha.value ||
        normalizar(x.fecha) === normalizar(fecha.value);


        return coincideTexto &&
        coincideModalidad &&
        coincideFecha;
    });


    contador.innerHTML = texto || modalidad.value || fecha.value
    ? lista.length + " resultados encontrados"
    : "Mostrando todas las peregrinaciones";


    mostrar(lista.slice(0,visibles));

    mas.style.display =
    lista.length > visibles ? "block" : "none";
}


function mostrar(lista){

    resultados.innerHTML = lista.map(x=>`

    <div class="card">
        <div class="nombre">🚶 ${x.nombre || ""}</div>
        <div class="dato">📍 ${x.origen || ""} ${x.provincia || ""}</div>
        <div class="dato">🗓 Llegada: ${x.fecha || ""}</div>
        <div class="dato">⏰ Hora: ${x.hora || ""}</div>
        <div class="dato">👥 Peregrinos: ${x.cantidad || ""}</div>
        <div class="dato">🚶 Modalidad: ${x.modalidad || ""}</div>
    </div>

    `).join("");
}
