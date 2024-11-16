
    
    
    //------ ACTUALIZAR EL ESTADO DE UN COMENTARIO A VISIBLE O NO Y NOTIFICARLO EN INTERFAZ SI ESTA OCULTO O NO----
    
    // ESTA ES LA FORMA PARA OBTENER EL RESULTADO DE CLICKAR BOTONES INDIVIDUALES Y TAMBIEN LOS ID COMMENTS DE CADA COMENTARIO. SE DEBE USAR EL EVENT TARGET PARA OBTENER EL BUTTON QUE SE ESTA PRESIONANDO
    async function definirEstadoComentario(){
        const hideButton = document.querySelectorAll('#button-hide');
        
        
        hideButton.forEach(button => {
        button.addEventListener("click", (e)=>{
            const buttonclicked = e.target

            //SE USA closest() PARA OBTENER EL CONTENEDO MAS CERCANOk
            const commentContainer = buttonclicked.closest('.comment');
                
            // Ahora dentro del contenedor del comentario, seleccionamos el ID del comentario
            const commentId = commentContainer.querySelector('.comment-id').textContent;

            // Tambien el del post para enviarselo a servidor y proceda con la actualizacion
            const postid = commentContainer.querySelector('.postid-id').textContent

            // Obtener el status del comentario "visible:true || visible:false" del post cargado
            const commentStatus = commentContainer.querySelector('.comment-status').textContent.trim()

            // Aqui esta el h3 mensaje de informacion de estatus de comentario para usuario autor del post
            const status_comment = commentContainer.querySelector("#status-comment-user")
            
            
            // si el comentario es visible entonces se le pasa el valor de false para que lo cambie en servidor y tambien al contrario
            const nombreButton = button.textContent.trim() == "Ocultar" ? button.textContent= "Mostrar": button.textContent= "Ocultar"

            
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

            
            
            })
        });
    }


    export function guardarComentarios(){
        // ------------------------GUARDADO DE COMENTARIO ----------------------------- //
        
        // AQUI SE CLICA EN GUARDAR COMENTARIO Y SE DESENCADENA LA OPERACION CON EL FETCH
        // Fetch para guardar comentario
        const aviso_comment = document.getElementById("aviso-comment")
        const formComment = document.getElementById("formComment")
        const btnComment = document.getElementById("btn-comment")
        const modal = document.getElementById("modal-register");
        const closeModal = document.getElementById("close-modal")
        
        // cerrar comentario
        closeModal.addEventListener("click", () => {
                modal.style.display = "none";
            });

        formComment.addEventListener("submit", (event)=>{
            event.preventDefault();

            const inputcomment = document.getElementById("comment-id").value.toString()
            const id_post = document.getElementById("id-post").textContent.toString()
            const formData = new FormData(formComment)
            const partialContainer = document.getElementById("partial-container")
            
            console.log("texto insertado: ", inputcomment)
            

            console.log("Id post para mandar a servidor: ", id_post)
            
            if(inputcomment == "" || inputcomment == null){
                aviso_comment.innerHTML = "Ingrese un comentario"
                
            }else{
                fetch(`/user/comment/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({comment :inputcomment, post_id:id_post})
                }).then(response => {
                    if (response.status === 401) {
                        console.log("Usuario no autenticado");
                        // Mostrar el modal de registro
                        modal.style.display = "block"; 
                    } else if (response.ok) {
                        console.log("Comentario creado con exito");
                        partialContainer.innerHTML=''
                        mostrarComentarios()
                    } else {
                        console.error("Error al crear el comentario");
                    }
                }).catch(error => {
                    console.error("Error:", error);
                });
            }

            
        })
    }

    export async function mostrarComentarios(){
        
        // const cuerpoPostBlog = document.querySelector('.container2');
        // console.log("cuerpo post: ", cuerpoPostBlog)

        const id_post = document.getElementById("id-post").textContent;  // Usa textContent para obtener el texto del div
        const partialContainer = document.getElementById("partial-container")
        console.log("ID del Post: ", id_post);
        
        try {
            const response = await fetch(`/comments/${id_post}`);
            const comments = await response.text(); 
            partialContainer.innerHTML = comments
            definirEstadoComentario()
            // EliminarComentario()
            responderComentariosPrincipales()
            // GetRequestsComments()
        } catch (error) {
            console.error("Error al cargar los comentarios: ", error);
        }
    }

    
    function responderComentariosPrincipales() {
        // Un solo listener para todo el contenedor de comentarios
        const commentContainer = document.getElementById("comment-container");
        
        commentContainer.addEventListener("click", async (event) => {
            // Identificar el botón o elemento clickeado
            const clickedButton = event.target.closest("button, #btn-morecomments");
            if(!clickedButton) return;
            
            // Comentar
            switch(clickedButton.id){
                //Mostrar cuadro comentario
                case "button-request":
                    event.preventDefault()
                    const comment = clickedButton.closest(".comment")
                    handleRequestButton(comment);
                    break;
                //CAncelar comentario
                case "button-cancel":
                    const commentRequest = clickedButton.closest(".comment")
                    handleCancel(commentRequest);
                    break;

                //GUardar COmentario
                case "btn-comment-request":
                    event.preventDefault()
                    const commentSave = clickedButton.closest(".comment")
                    await handleSaveComment(commentSave);
                    break;

                //Desplegar respuestas
                case "btn-morecomments":
                    console.log("Show comments clcik")
                    event.preventDefault()
                    const commentShow = clickedButton.closest(".comment");
                    await handleShowComments(commentShow)
                    break;

                //Eliminar COmentario
                case "button-delete":
                    event.preventDefault()
                    const commentDelete = clickedButton.closest(".comment")
                    await handleDeleteComment(commentDelete);
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
        const contBtnComments = comment.querySelector(".comment-ocultar-delete");
        const commentAuthor = comment.querySelector(".comment-author").textContent.trim();
        
        // Mostrar formulario de respuesta
        containerRequest.style.display = "block";
        contBtnComments.style.display = "none";
        
        // Actualizar nombre del destinatario
        comment.querySelector("#request-name").innerHTML = commentAuthor;
    }
    
    function handleCancel(comment) {
        const containerRequest = comment.querySelector(".container-form-commentrequest");
        const contBtnComments = comment.querySelector(".comment-ocultar-delete");
        
        containerRequest.style.display = "none";
        contBtnComments.style.display = "flex";
    }
    
    async function handleSaveComment(comment) {
        const commentRequest = comment.querySelector("#comment-content-request");
        const commentText = commentRequest.value.trim();
        if (!commentText) return;
        
        const idComment = comment.querySelector(".comment-id").textContent.trim();
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

    // function responderComentariosPrincipales(){
    //     console.log("Funcionando responder comentario")
    //     // let commentContainer = document.closest("#commentsTotales")
    //     // console.log(commentContainer)
    //     const btnrequest = document.querySelectorAll("#button-request")
        
    //     btnrequest.forEach(btn=>{
    //         btn.addEventListener("click",()=>{
    //             let informacion = []
    //             const comment = btn.closest(".comment")
    //             const idComment = comment.querySelector(".comment-id").textContent.trim()
    //             const containerRequest = comment.querySelector(".container-form-commentrequest")
    //             const contbtncomments = comment.querySelector(".comment-ocultar-delete")
    //             const btnCancel = comment.querySelector("#button-cancel")
    //             const commentAuthor = comment.querySelector(".comment-author").textContent.trim()
    //             const nameComplete = commentAuthor.replace(/\s+/g, "") + " ";
    //             const requestName = comment.querySelector("#request-name")
    //             const idmessageparent = idComment
    //             console.log("Id comentario : ",  idComment)
    //             console.log("Id message parent: ", idmessageparent)
    //             containerRequest.style.display = "block"

    //             // Aquie estoy cargando el nombre a quien responderé
    //             requestName.innerHTML = commentAuthor
    //             contbtncomments.style.display = "none"
    //             CancelComment(btnCancel, containerRequest, contbtncomments)
    //             //Id del Post entero
    //             const id_post = document.getElementById("id-post").textContent.trim().toString()
    //             //Id del comentario Padre
    //             const idcomment = idComment.toString()
    //             const commentRequest = comment.querySelector("#comment-content-request")
    //             informacion = [id_post,idmessageparent,commentAuthor.toString(), commentRequest]

    //             const btnSave = comment.querySelector("#btn-comment-request")
    //             SaveRequest(btnSave, informacion)
                
    //         })
    //     })
    // }

// function responderComentariosHijos(idcommentparent){
    //     console.log("Funcionando responder comentario")
    //     // let commentContainer = document.closest("#commentsTotales")
    //     // console.log(commentContainer)
    //     const btnrequest = document.querySelectorAll("#button-request")
        
    //     btnrequest.forEach(btn=>{
    //         btn.addEventListener("click",()=>{
    //             let informacion = []
    //             const comment = btn.closest(".comment")
    //             const idComment = comment.querySelector(".comment-id").textContent.trim()
    //             const containerRequest = comment.querySelector(".container-form-commentrequest")
    //             const contbtncomments = comment.querySelector(".comment-ocultar-delete")
    //             const btnCancel = comment.querySelector("#button-cancel")
    //             const commentAuthor = comment.querySelector(".comment-author").textContent.trim()
    //             const nameComplete = commentAuthor.replace(/\s+/g, "") + " ";
    //             const requestName = comment.querySelector("#request-name")
    //             // const idmessageparent = comment.querySelector(".messageparent-id").textContent.trim()
    //             const idmessageparent = idcommentparent
    //             console.log("Id comentario : ",  idComment)
    //             console.log("Id message parent: ", idmessageparent)
    //             containerRequest.style.display = "block"

    //             // Aquie estoy cargando el nombre a quien responderé
    //             requestName.innerHTML = commentAuthor
    //             contbtncomments.style.display = "none"
    //             CancelComment(btnCancel, containerRequest, contbtncomments)
    //             //Id del Post entero
    //             const id_post = document.getElementById("id-post").textContent.trim().toString()
    //             //Id del comentario Padre
    //             const idcomment = idComment.toString()
    //             const commentRequest = comment.querySelector("#comment-content-request")
    //             informacion = [id_post,idmessageparent,commentAuthor.toString(), commentRequest]

    //             const btnSave = comment.querySelector("#btn-comment-request")
    //             SaveRequest(btnSave, informacion)
                
    //         })
    //     })
    // }

    // Funcion para ocultar comentario y mostrar la cinta de botones como comentar, ocultar, eliminar.
    
// function CancelComment(btnCancel, containerRequest, contbtncomments){
//         btnCancel.addEventListener("click", ()=>{
//             containerRequest.style.display = "none"
//             contbtncomments.style.display = "flex"
//         })
//     }

    // function SaveRequest(btnSave, information){
    //     btnSave.addEventListener("click", (e)=>{
    //         e.preventDefault()
    //         const post_id = information[0]
    //         let idmessageparent = information[1]
    //         const requestName = information[2]
    //         const comment = information[3].value.trim().toString()
    //         // const id_post = document.getElementById("id-post").textContent.toString()
    //         console.log( post_id, idmessageparent, requestName, comment)
    //         fetch("/comment/request",
    //             {
    //                 method:'POST',
    //                 headers: {'Content-Type': 'application/json'},
    //                 body: JSON.stringify(
    //                     {
    //                         post_id:post_id,
    //                         idmessageparent:idmessageparent,
    //                         requestname:requestName, 
    //                         comment :comment
    //                     }
    //                 )
    //             }
    //         )
    //         .then(response => response.json())
    //         .then(data=>{
    //             console.log(data)
    //             const partialRequests = document.querySelector("#partial-request-cont")
    //             partialRequests.innerHTML = ""
    //             GetRequestsComments()
    //         })
    //         .catch(error => {
    //             console.error("Error:", error);
    //         });
    //     })
    // }

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
            definirEstadoComentario();
            // responderComentariosHijos(idcommentparent);
            // EliminarComentario();
        } else {
            partialRequests.innerHTML = "";
        }
    }