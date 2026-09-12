
let datos = [];
let visibles = 20;

const $ = id => document.getElementById(id);

const normalizar = texto =>
    (texto || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .trim();

fetch("./peregrinos_milagro_2026.json")
.then(res => {
    if(!res.ok) throw new Error("JSON no encontrado");
    return res.json();
})
.then(json => {
    datos = json.map(x => ({
        ...x,
        _texto: normalizar(JSON.stringify(x))
    }));

    $("estado").innerHTML = "🟢 Base conectada: " + datos.length + " peregrinaciones cargadas";

    cargarFiltros();
    buscarDatos();
})
.catch(error => {
    console.error(error);
    $("estado").innerHTML = "🔴 Error al cargar la base de datos: " + error.message;
});

function cargarFiltros(){

    let modalidades = [...new Set(
        datos.map(x=>x.modalidad).filter(Boolean)
    )];

    modalidades.forEach(m=>{
        $("modalidad").innerHTML += `<option>${m}</option>`;
    });

    let fechas=[...new Set(
        datos.map(x=>x.fecha).filter(Boolean)
    )];

    fechas.forEach(f=>{
        $("fecha").innerHTML += `<option>${f}</option>`;
    });
}

$("buscar").addEventListener("input",()=>{
    visibles=20;
    buscarDatos();
});

$("modalidad").addEventListener("change",buscarDatos);
$("fecha").addEventListener("change",buscarDatos);

$("mas").addEventListener("click",()=>{
    visibles+=20;
    buscarDatos();
});


function buscarDatos(){

    let texto=normalizar($("buscar").value);

    let resultado=datos.filter(x=>{

        let palabras=texto.split(" ").filter(Boolean);

        let coincide=palabras.every(p=>x._texto.includes(p));

        let mod=!$("modalidad").value ||
        x.modalidad===$("modalidad").value;

        let fecha=!$("fecha").value ||
        x.fecha===$("fecha").value;

        return coincide && mod && fecha;
    });


    $("contador").innerHTML =
    resultado.length+" peregrinaciones encontradas";


    mostrar(resultado.slice(0,visibles));

    $("mas").style.display =
    resultado.length>visibles ? "block":"none";
}


function mostrar(lista){

$("resultados").innerHTML =
lista.map(x=>`

<div class="card">

<div class="nombre">
🚶 ${x.nombre || ""}
</div>

<div class="dato">📍 ${x.origen || ""} ${x.provincia || ""}</div>

<div class="dato">🗓 Llegada: ${x.fecha || ""}</div>

<div class="dato">⏰ Hora: ${x.hora || ""}</div>

<div class="dato">👥 Peregrinos: ${x.cantidad || ""}</div>

<div class="dato">🚶 Modalidad: ${x.modalidad || ""}</div>

</div>

`).join("");

}
