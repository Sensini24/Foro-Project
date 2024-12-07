export function initAddPost(){
    console.log("Iniciando módulo de add post");
    const cuerpoPost = document.querySelector('#cuerpoPost');
    if (!cuerpoPost) return;
    const quillEditor = document.getElementById("editor-container");

    var quill = new Quill(quillEditor, {
        theme: 'snow',  // Usa el tema 'snow' para un diseño básico
        size: '26px', 
        modules: {
            toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline']
            ]
        },
        placeholder: "Escribe algo, sobre libros..."
    });
    
    const titulo = document.getElementById("titlecontent")
    const btntexto = document.getElementById("btn-texto")
    const content = document.getElementById("content")
    const tags = document.getElementById("tags")

    const formPost = document.getElementById("formPost")
    const btnSbumit = document.getElementById("btn-submit")


    formPost.addEventListener("submit", (event)=>{
        event.preventDefault();
        
        //TITULO
        const title = titulo.value

        //TAGS
        const tagsContent = tags.value

        //cuerpo del editor de texto QUILL
        const contenidoQuill = quill.getText();
        content.value = contenidoQuill

        const quillLength = quill.getLength();  // quill.getLength() obtiene la longitud real del contenido

        // Si no hay contenido (longitud menor o igual a 1), lo marcamos como vacío
        if (quillLength <= 1) {
            showModal("El contenido del post es requerido");
            return;
        }
        
        fetch("/post/addpost", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title:title.toString(), content: content.value.toString(), tags:tagsContent})
        })
        .then(response => response.json()
        )
        .then(data=>{
            showModal(data.message)
            if(!data.ok){
                showModal(data.message)
            }else{
                showModal(data.message)
                // Opcionalmente, redirigir tras un pequeño retraso
                setTimeout(() => {
                    window.location.href = "/user/posts";
                }, 2000); // Redirige a los posts después de 2 segundos
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showModal("Error de conexión con el servidor");
        });
    })
    
    
}
async function showModal(message) {
    console.log(message)
    const modal = document.getElementById('myModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = "block"; // Mostrar modal

    const cerrar = document.querySelector(".close")
    cerrar.addEventListener("click", ()=>{
        modal.style.display = "none";
    })
}

initAddPost();