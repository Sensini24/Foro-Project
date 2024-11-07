
    // ESTA PARTE LO LLAMO EN MOSTRAR COMENTARIOS EL CUAL ES LA FUNCION DONDE SE LLAMA AL DOM Y TODO EL CONTENIDO DE LOS COMENTARIOS: ETIQUETAS, ETC; LO QUE PERMITE QUE PODAMOS SELECCIONARLOS PARA PODER ELIMINARLOS
    async function EliminarComentario(){

        const comentarioContenedor = Array.from(document.querySelectorAll(".comment"))
        // const idComentario = Array.from(document.querySelectorAll(".comment-id"))
        const authorComentario = Array.from(document.querySelectorAll(".comment-author"))
        const btndelete = document.querySelectorAll("#button-delete")

        btndelete.forEach(btn=>{
            btn.addEventListener("click",()=>{
                const comment = btn.closest(".comment")
                const idComment = comment.querySelector(".comment-id").textContent.trim()
                const idPost = comment.querySelector(".postid-id").textContent.trim()
                console.log("container delete : ",  idComment)
                fetchEliminar(idComment, idPost, comment)
            })
        })
        
    }
    // funcion que alberga un fetch para eliminar y que pide dos parametros
    function fetchEliminar(id, idPost, commentContainer){
        const partialContainer = document.getElementById("partial-container")
        fetch(`/user/deleteComments/${id}`,{
            method:"DELETE",
            headers: {
                    'Content-Type': 'application/json'
                },
            body:JSON.stringify({id:id.toString(), idPost:idPost.toString()})
        }
        )
        .then(response =>{
            if(response.ok){
                console.log("Comentario eliminado")
                // partialContainer.innerHTML = ""
                // mostrarComentarios()
                commentContainer.remove()
            }
        }).catch(error => {
                console.error("Error:", error);
        });
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
            EliminarComentario()
        } catch (error) {
            console.error("Error al cargar los comentarios: ", error);
        }
    }

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
                        inputcomment.textContent = ""
                    } else {
                        console.error("Error al crear el comentario");
                    }
                }).catch(error => {
                    console.error("Error:", error);
                });
            }

            
        })
    }
