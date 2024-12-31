    //* ------ ACTUALIZAR EL ESTADO DE UN COMENTARIO A VISIBLE O NO Y NOTIFICARLO EN INTERFAZ SI ESTA OCULTO O NO----

import { convertDate } from "./notificationclient.js";

    export async function initGetComments(){
        const socket = initializeSocket();

        guardarComentarios(socket);
        await mostrarComentarios();
        
    }

    function initializeSocket() {
        return io({
            auth: {
                serverOffset: 0
            }
        });
    }

    function getDomElements (){
        return{
            time : document.querySelectorAll(".comment-date")
        }
    }

    
    //* ESTA ES LA FORMA PARA OBTENER EL RESULTADO DE CLICKAR BOTONES INDIVIDUALES Y TAMBIEN LOS ID COMMENTS DE CADA COMENTARIO. SE DEBE USAR EL EVENT TARGET PARA OBTENER EL BUTTON QUE SE ESTA PRESIONANDO

    async function handleHideComment(commentContainer){
        const hideButton = document.querySelectorAll('#button-hide')

            // Ahora dentro del contenedor del comentario, seleccionamos el ID del comentario
            const commentId = commentContainer.querySelector('.comment-id').textContent;

            // Tambien el del post para enviarselo a servidor y proceda con la actualizacion
            const postid = commentContainer.querySelector('.postid-id').textContent

            // Obtener el status del comentario "visible:true || visible:false" del post cargado
            const commentStatus = commentContainer.querySelector('.comment-status').textContent.trim()

            // Aqui esta el h3 mensaje de informacion de estatus de comentario para usuario autor del post
            const status_comment = commentContainer.querySelector("#status-comment-user")
            
            
            // si el comentario es visible entonces se le pasa el valor de false para que lo cambie en servidor y tambien al contrario
            // const nombreButton = button.textContent.trim() == "Ocultar" ? button.textContent= "Mostrar": button.textContent= "Ocultar"

            const buttonHide = commentContainer.querySelector("#button-hide")
            const nombreButton = buttonHide.textContent.trim() == "Ocultar" ? buttonHide.textContent= "Mostrar": buttonHide.textContent= "Ocultar"

            
            //Cada vez que se presiona el button de ocultar o mostrar se cambia el estado actual del comentario y se le pasa a servidor para que actualice el estado.
            // OJO: Aqui le paso el nombre del boton y no el nombre de status ya que una vez cambiado el status en variable, no vuelve a renovar su valor xq en cliente aun no se cambia al nuevo status que esta en base de datos: digamos que le pasamos el vallor de true y este mmuestra el comentario y ahora queremos ocultarlo, si obtenermos el valor de cliente este seguira en false, de modo que tomara false y cambiara a true, es decir volvera a lo mismo, ya que antes no se actualizo la pagina y no se obtuvo el valor antes cambiado.
            let status = nombreButton == "Mostrar" ? false:true;

            //Mostrar mensaje guia de estado de comentario usando el estado del button ocultar o mostrar.
            let mensajeComment = nombreButton =="Ocultar" ? status_comment.textContent = "": status_comment.textContent = "Este comentario es visible solo para tí."
            
            console.log("ID del comentario clicado: ", commentId);
            console.log("Comment Status: ", commentStatus);
            console.log("Mensaje de comment: ", mensajeComment)
            // console.log(nombreButton)
            // console.log("Comment postId: ", postid)
            // status_comment.textContent = "Este comentario esta oculto para los demás"
            // console.log("Mensaje de estatus: ", status_comment.textContent)
            console.log("VARIABLE STATUS CAMBIADA: ", status)
            
            // Fetch para actualizar status
            fetch(`/comment/put/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ visible: status }) // Enviar el estado de visibilidad en el cuerpo de la solicitud
            }).then(response => {
                if (response.ok) {
                    console.log("Comentario ocultado con éxito");
                    
                } else {
                    console.error("Error al ocultar el comentario");
                }
            }).catch(error => {
                console.error("Error:", error);
            });

    }
    export function guardarComentarios(socket) {
        const aviso_comment = document.getElementById("aviso-comment");
        const formComment = document.getElementById("formComment");
        const btnComment = document.getElementById("btn-comment");
        const modal = document.getElementById("modal-register");
        const closeModal = document.getElementById("close-modal");
    
        // Verifica si los elementos existen antes de agregar lógica
        if (closeModal && modal) {
            closeModal.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }
    
        if (formComment) {
            formComment.addEventListener("submit", (event) => {
                event.preventDefault();
    
                const inputcomment = document.getElementById("comment-id")?.value.trim();
                const id_post = document.getElementById("id-post")?.textContent.trim();
                const partialContainer = document.getElementById("partial-container");
    
                if (!inputcomment) {
                    aviso_comment.innerHTML = "Ingrese un comentario";
                    return;
                }
    
                fetch(`/user/comment/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ comment: inputcomment, post_id: id_post }),
                })
                    .then((response) => {
                        if (response.status === 401) {
                            console.log("Usuario no autenticado");
                            if (modal) modal.style.display = "block";
                        } else if (response.ok) {
                            console.log("Comentario creado con éxito");
                            partialContainer.innerHTML = "";
                            mostrarComentarios(id_post, inputcomment);
                            sendCommentNotification(socket,id_post, inputcomment)
                        } else {
                            console.error("Error al crear el comentario");
                        }
                    })
                    .catch((error) => console.error("Error:", error));
            });
        }
    }
    

    export async function mostrarComentarios(){
        console.log("Iniciando módulo de comentarios");
        
        // const cuerpoPostBlog = document.querySelector('.container2');
        // console.log("cuerpo post: ", cuerpoPostBlog)

        const id_post = document.getElementById("id-post").textContent.trim();
        const partialContainer = document.getElementById("partial-container")
        console.log("ID del Post: ", id_post);
        try {
            const response = await fetch(`/comments/request/${id_post}`)
            const comments = await response.text(); 
            partialContainer.innerHTML = comments
            responderComentariosPrincipales()

            const domElements = getDomElements()
            convertDate(domElements)
        } catch (error) {
            console.error("Error al cargar los comentarios: ", error);
        }
    }
    
    
    function responderComentariosPrincipales() {
        //* AQui obtengo el contenedor principal de los comentarios para agregarle un solo listener
        const commentContainer = document.getElementById("comment-container");
        commentContainer.addEventListener("click", async (event) => {
            //! Identificar el botón o elemento clickeado
            const clickedButton = event.target.closest("button, #btn-morecomments");
            if(!clickedButton) return;
            const comment = clickedButton.closest(".comment")
            // Comentar
            switch(clickedButton.id){
                //Mostrar cuadro comentario
                case "button-request":
                    event.preventDefault()
                    handleRequestButton(comment);
                    break;
                //CAncelar comentario
                case "button-cancel":
                    event.preventDefault()
                    handleCancel(comment);
                    break;

                //GUardar COmentarios Padre
                case "btn-comment-request":
                    event.preventDefault()
                    await handleSaveCommentfather(comment);
                    break;

                //Desplegar respuestas
                case "btn-morecomments":
                    event.preventDefault()
                    await handleShowComments(comment)
                    break;

                //Eliminar COmentario
                case "button-delete":
                    event.preventDefault()
                    await handleDeleteComment(comment);
                    break;

                //Ocultar Comentario
                case "button-hide":
                    event.preventDefault()
                    console.log("Comment Hide: ",comment)
                    await handleHideComment(comment);
                    break;
                    
                    
                
            }
        });
    }

    // ESTA PARTE LO LLAMO EN MOSTRAR COMENTARIOS EL CUAL ES LA FUNCION DONDE SE LLAMA AL DOM Y TODO EL CONTENIDO DE LOS COMENTARIOS: ETIQUETAS, ETC; LO QUE PERMITE QUE PODAMOS SELECCIONARLOS PARA PODER ELIMINARLOS
    async function handleDeleteComment(comment){
        const idComment = comment.querySelector(".comment-id").textContent.trim()
        const idPost = comment.querySelector(".postid-id").textContent.trim()
        console.log("container delete : ",  idComment)
        await fetchEliminar(idComment, idPost, comment)
        
    }
    // funcion que alberga un fetch para eliminar y que pide dos parametros
    async function fetchEliminar(id, idPost, commentContainer){
        const partialContainer = document.getElementById("partial-container")
        const response = await fetch(`/user/deleteComments/${id}`,{
            method:"DELETE",
            headers: {
                    'Content-Type': 'application/json'
                },
            body:JSON.stringify({id:id.toString(), idPost:idPost.toString()})
        }
        )
        const data = response.ok ? commentContainer.remove() : console.error("Error:", error);
    }
    
    function handleRequestButton(comment) {
        const containerRequest = comment.querySelector(".container-form-commentrequest");
        const contBtnComments = comment.querySelector(".comment-actions");
        const commentAuthor = comment.querySelector(".comment-author").textContent.trim();
        
        // Mostrar formulario de respuesta
        containerRequest.style.display = "block";
        contBtnComments.style.display = "none";
        
        // Actualizar nombre del destinatario
        comment.querySelector("#request-name").innerHTML = commentAuthor;
    }
    
    function handleCancel(comment) {
        
        const containerRequest = comment.querySelector(".container-form-commentrequest");
        const contBtnComments = comment.querySelector(".comment-actions");
        containerRequest.style.display = "none";
        contBtnComments.style.display = "flex";
        
    }
    
    async function handleSaveCommentfather(comment) {
        console.log("Desde padre")
        const commentRequest = comment.querySelector("#comment-content-request");
        const commentText = commentRequest.value.trim();
        if (!commentText) return;
        
        // Declaramos el ID del comentario padre
        let idComment;

        // Intentamos obtener el messageparent
        const messageparenteElement = comment.querySelector("#id-messageparent");
        const messageparente = messageparenteElement ? messageparenteElement.textContent.trim() : null;

        console.log("Message parent:", messageparente);

        // en caso de que el messageparent existe quiere decir que esstas comentando a un comentario y que tiene su idparent al id del comentario padre
        if (messageparente) {
            idComment = messageparente;
        } else {
            // Caso contrario, se le asigna el id del comentario padre
            const idCommentElement = comment.querySelector("#id-comment");
            idComment = idCommentElement ? idCommentElement.textContent.trim() : null;
            console.log("Id comment:", idComment);
        }


        const commentAuthor = comment.querySelector(".comment-author").textContent.trim();
        const postId = document.getElementById("id-post").textContent.trim();
        
            
        try {
            const response = await fetch("/comment/request", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: postId,
                    idmessageparent: idComment,
                    requestname: commentAuthor,
                    comment: commentText
                })
            });
    
            const data = await response.json();
            console.log("Respuesta del servidor:", data);
    
            // Actualizar vista
            const partialRequests = comment.querySelector("#partial-request-cont");
            partialRequests.innerHTML = "";
            // Limpiar y cerrar el formulario
            commentRequest.value = "";
            handleCancel(comment);
            await handleShowComments(comment);
        } catch (error) {
            console.error("Error al guardar el comentario:", error);
        }
    }


    async function handleShowComments(comment){
        console.log("Show comments click")
        const idcommentparent = comment.querySelector(".comment-id").textContent.trim();
        const id = document.getElementById("id-post").textContent.trim();
        const partialRequests = comment.querySelector("#partial-request-cont");

        const isExpanded = partialRequests.innerHTML !== "";
    
        if (!isExpanded) {
            const response = await fetch(`/comments/request/${id}/${idcommentparent}`)
            const data = await response.text()
            partialRequests.innerHTML = data;
            const domElements = getDomElements()
            convertDate(domElements)
        } else {
            partialRequests.innerHTML = "";
        }
    }

    const sendCommentNotification =(socket,idpost, comment)=>{
        console.log("Notifiacion enviada de comentario")
        socket.emit("messageNotification", idpost, comment)
    }