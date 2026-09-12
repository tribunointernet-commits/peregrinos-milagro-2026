
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
.then(r => r.json())
.then(json => {

    datos = json.map(x => ({
        ...x,
        _texto: normalizar(JSON.stringify(x))
    }));

    cargarModalidades();
    cargarFechas();
    buscarDatos();

})
.catch(e => console.error("Error JSON",e));


function cargarModalidades(){

    let lista = [...new Set(
        datos
        .map(x => x.modalidad)
        .filter(x => x && x.trim() !== "")
    )];

    lista.sort();

    lista.forEach(item=>{
        let opcion=document.createElement("option");
        opcion.value=item;
        opcion.textContent=item;
        modalidad.appendChild(opcion);
    });
}


function cargarFechas(){

    let lista=[...new Set(
        datos
        .map(x=>x.fecha)
        .filter(x=>x && x.trim()!=="")
    )];

    lista.sort();

    lista.forEach(item=>{
        let opcion=document.createElement("option");
        opcion.value=item;
        opcion.textContent=item;
        fecha.appendChild(opcion);
    });
}


buscar.addEventListener("input",()=>{
    visibles=20;
    buscarDatos();
});

modalidad.addEventListener("change",buscarDatos);
fecha.addEventListener("change",buscarDatos);

mas.addEventListener("click",()=>{
    visibles+=20;
    buscarDatos();
});


function buscarDatos(){

    let texto=normalizar(buscar.value);

    let lista=datos.filter(x=>{

        let textoOk=!texto ||
        texto.split(" ").every(p=>x._texto.includes(p));

        let modalidadOk=!modalidad.value ||
        normalizar(x.modalidad)===normalizar(modalidad.value);

        let fechaOk=!fecha.value ||
        x.fecha===fecha.value;

        return textoOk && modalidadOk && fechaOk;
    });


    contador.textContent =
    texto || modalidad.value || fecha.value
    ? lista.length+" resultados encontrados"
    : "Mostrando todas las peregrinaciones";


    resultados.innerHTML=lista.slice(0,visibles).map(x=>`
    <div class="card">
    <div class="nombre">🚶 ${x.nombre||""}</div>
    <div class="dato">📍 ${x.origen||""} ${x.provincia||""}</div>
    <div class="dato">🗓 Llegada: ${x.fecha||""}</div>
    <div class="dato">⏰ Hora: ${x.hora||""}</div>
    <div class="dato">👥 Peregrinos: ${x.cantidad||""}</div>
    <div class="dato">🚶 Modalidad: ${x.modalidad||""}</div>
    </div>`).join("");

    mas.style.display=lista.length>visibles?"block":"none";
}
