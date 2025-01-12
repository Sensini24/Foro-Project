import { getModalInfo, getToastSuccessfull } from "./modales.js";
import { convertDate } from "./notificationclient.js";

export async function initCommentsModule() {
    console.log("INICIANDO MODULOS DE COMENTARIOS");

    const domElements = getDomElements();
    const socket = initializeSocket();

    handlerCommentSocket(socket);
    await renderComments(domElements);
    closeModal();
    SearhCommentNotification();
    showMenuAllComments();
}



//? BUSCA EL COMENTARIO A TRAVES DEL ID SEGUIDO DEL HASH Y SI NO EXISTE ENVIA UN MODAL DE AVISO.
function SearhCommentNotification() {
    const observer = new MutationObserver((mutations) => {
        // console.log("DOM cambió:", mutations);
        const commentId = window.location.hash.substring(1);
        // console.log("HASH:", commentId);
        if(commentId){
            const targetComment = document.getElementById(commentId);

            if (targetComment) {
                const header = targetComment.closest(".main-comment");
                console.log("Elemento encontrado:", targetComment.textContent);
                targetComment.scrollIntoView({ behavior: "smooth", block: "center" });
                header.style.backgroundColor = "#D79921";
                observer.disconnect(); // Detén la observación
            } else {
                const modalWithoutComment = document.querySelector(".modal-without-comment");
                if (modalWithoutComment) {

                    //? Mostrar modal de aceptacion si no hay comentario
                    getModalInfo(modalWithoutComment,"No se encontró el comentario. Probablemente fue eliminado.")
                    observer.disconnect(); // Detén la observación
                    
                } else {
                    console.log("El modal no está en el DOM todavía, seguimos observando...");
                }
            }
        }
        
    });

    observer.observe(document.body, { childList: true, subtree: true });
}


// Configuración del socket
function initializeSocket() {
    return io({
        auth: { serverOffset: 0 }
    });
}

// Obtener elementos DOM comunes
function getDomElements() {
    return {
        time: document.querySelectorAll(".comment-date"),
        partialContainer: document.getElementById("partial-container"),
        commentContainer: document.getElementById("comment-container"),
        chatIcon : document.querySelector(".chat-icon"),
        // menuButton : document.que
    };
}

// Renderizar comentarios en la interfaz
async function renderComments(domElements) {
    
    const postId = getPostId();
    const partialContainer = document.getElementById("partial-container");

    try {
        const response = await fetch(`/comments/request/${postId}`);
        const commentsHtml = await response.text();
        partialContainer.innerHTML = ""
        partialContainer.innerHTML = commentsHtml;
        
        const time = document.querySelectorAll(".comment-date-parent")
        console.log("time: ", time)

        
        if(time){
            await convertDate(time);
            console.log("type of time en get comments: ", typeof time)
        }else{
            console.log("No se encontro time")
        }
        //? CARGA LOS MANEJADORES DE INTERACCIONES COMO RESPONDER, ELIMINAR, CANCELAR, ETC
        attachCommentEventListeners();
        
    } catch (error) {
        console.error("Error al cargar los comentarios: ", error);
    }
}

// Manejo de eventos de comentarios
function attachCommentEventListeners() {
    const commentContainer = document.getElementById("comment-container")
    if (!commentContainer) return console.log("no hay comment container");
    commentContainer.addEventListener("click", async (event) => {
        const clickedButton = event.target.closest("button, #btn-morecomments");
        if (!clickedButton) return;

        const comment = clickedButton.closest(".comment");
        switch (clickedButton.id) {
            case "button-request":
                handleReplyRequest(comment);
                break;
            case "button-cancel":
                event.preventDefault()
                handleCancelReply(comment);
                break;
            case "btn-comment-request":
                event.preventDefault()
                await handleSaveReply(comment);
                break;
            case "btn-morecomments":
                await toggleCommentReplies(comment);
                break;
            case "button-delete":
                await deleteComment(comment);
                break;
            case "button-hide":
                await changeVisibility(comment);
                break;
        }

    });
}

// Obtener el ID del post actual
function getPostId() {
    return document.getElementById("id-post")?.textContent.trim();
}

// Mostrar formulario para responder un comentario
function handleReplyRequest(comment) {
    const formContainer = comment.querySelector(".container-form-commentrequest");
    const textarea = comment.querySelector("#comment-content-request")
    const actionButtons = comment.querySelector(".comment-actions");
    const authorName = comment.querySelector(".comment-author")?.textContent.trim();

    textarea.value = textarea.value.trim()
    formContainer.style.display = "flex";
    // actionButtons.style.display = "none";
    comment.querySelector("#request-name").textContent = authorName;
}

// Cancelar respuesta
function handleCancelReply(comment) {
    const formContainer = comment.querySelector(".container-form-commentrequest");
    const actionButtons = comment.querySelector(".comment-actions");

    formContainer.style.display = "none";
    actionButtons.style.display = "flex";
}

// Guardar respuesta a un comentario
async function handleSaveReply(comment) {
    const commentText = comment.querySelector("#comment-content-request")?.value.trim();
    if (!commentText) return;

    const parentId = getCommentParentId(comment);
    const postId = getPostId();
    const authorName = comment.querySelector(".comment-author")?.textContent.trim();

    try {
        const response = await fetch("/comment/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                post_id: postId,
                idmessageparent: parentId,
                requestname: authorName,
                comment: commentText,
            }),
        });

        if (response.ok) {
            comment.querySelector("#partial-request-cont").innerHTML = "";
            comment.querySelector("#comment-content-request").value = "";
            handleCancelReply(comment);
            await toggleCommentReplies(comment);
        } else {
            console.error("Error al guardar la respuesta");
        }
    } catch (error) {
        console.error("Error al guardar la respuesta:", error);
    }
}

// Obtener el ID del comentario padre
function getCommentParentId(comment) {
    const parentId = comment.querySelector("#id-messageparent")?.textContent.trim();
    return parentId || comment.querySelector("#id-comment")?.textContent.trim();
}

// Mostrar/ocultar respuestas a un comentario
async function toggleCommentReplies(comment) {
    const parentId = comment.querySelector(".comment-id")?.textContent.trim();
    const postId = getPostId();
    const replyContainer = comment.querySelector("#partial-request-cont");

    if (replyContainer.innerHTML) {
        replyContainer.innerHTML = ""; // Ocultar respuestas
    } else {
        try {
            const response = await fetch(`/comments/request/${postId}/${parentId}`);
            const repliesHtml = await response.text();
            replyContainer.innerHTML = repliesHtml;
            const time = document.querySelectorAll(".comment-date-childe")
            convertDate(time);
        } catch (error) {
            console.error("Error al cargar las respuestas: ", error);
        }
    }
}

// Eliminar comentario
async function deleteComment(comment) {
    const commentId = comment.querySelector(".comment-id")?.textContent.trim();
    const replies = comment.closest(".replies")
    const mainContent = comment.closest(".main-comment")
    const postId = getPostId();

    try {
        const response = await fetch(`/user/deleteComments/${commentId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: commentId, idPost: postId }),
        });

        if (response.ok) {
            if(replies){
                replies.remove();
            }

            comment.remove()
            
        } else {
            console.error("Error al eliminar el comentario");
        }
    } catch (error) {
        console.error("Error al eliminar el comentario: ", error);
    }
}

// Cambiar visibilidad de un comentario
async function changeVisibility(comment) {
    const commentId = comment.querySelector(".comment-id")?.textContent.trim();
    const statusIndicator = comment.querySelector("#status-comment-user");
    const hideButton = comment.querySelector("#button-hide");

    const isCurrentlyVisible = hideButton.textContent.trim() === "Ocultar";
    const newVisibility = !isCurrentlyVisible;

    hideButton.textContent = isCurrentlyVisible ? "Mostrar" : "Ocultar";
    statusIndicator.textContent = isCurrentlyVisible
        ? "Este comentario es visible solo para ti."
        : "";

    try {
        const response = await fetch(`/comment/put/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visible: newVisibility }),
        });

        if (!response.ok) {
            console.error("Error al actualizar visibilidad del comentario");
        }
    } catch (error) {
        console.error("Error al cambiar visibilidad:", error);
    }
}

//? Configuración de eventos de envío de comentarios
function handlerCommentSocket(socket) {
    const formComment = document.getElementById("formComment");

    if (formComment) {
        formComment.addEventListener("submit", async (event) => {
            event.preventDefault();
            await submitComment(socket);
        });
    }
}

//? Enviar comentario al servidor
async function submitComment(socket) {
    const inputComment = document.getElementById("comment-id")?.value.trim();
    const authorPost = document.querySelector(".blog-author").textContent.trim();
    const postId = getPostId();
    const namePost = document.querySelector("#title-post").textContent.trim();

    if (!inputComment) {
        document.getElementById("aviso-comment").textContent = "Ingrese un comentario";
        return;
    }

    try {
        const response = await fetch(`/user/comment/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: inputComment, post_id: postId }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log("Comentario creado con éxito");
            console.log("Comment ID:", data.commentId);
            const commentId = data.commentId
            // document.getElementById("partial-container").innerHTML = "";
            await renderComments();
            
            const elem = document.querySelector("#modal-success")
            const messageModalSuccess = "Comentario creado exitosamente"
            
            showModalSucces(elem, messageModalSuccess)//Mostrar modal

            //? Se envia informacion del comment a notifiacion socket para su guardado
            await sendMessageSocket(socket, postId, authorPost, namePost, inputComment,commentId );

        } else {
            console.log("No se guardó el comentario:", data.error);
            document.querySelector(".modal").style.display = "flex";
        }
        
    } catch (error) {
        console.error("Error:", error);
    }
}

async function sendMessageSocket(socket, postId,nameuser, namePost, comment, commentId){
    socket.emit("messageNotification", postId,nameuser, namePost, comment, commentId )
}

//? Modal de confirmacion
function showModalSucces(elem, messageModalSuccess){
    getToastSuccessfull(elem, messageModalSuccess)
}

function closeModal (){
    document.querySelector("#close-modal").addEventListener("click", ()=>{
        document.querySelector(".modal").style.display = "none";
    })
    
}

//?Mostrar modal de comments: edita, etc.======================================
function showMenuAllComments(){
    const commentContainer = document.getElementById("comment-container")
    const commentContainerRequest = document.getElementById("partial-request-cont")
    showMenuComments(commentContainer || commentContainerRequest)
    // showMenuComments2(commentContainerRequest)
}

function showMenuComments(container) {
    container.addEventListener("click", (event) => {
        // console.log("Evente", event.target)
        const puntos = event.target.closest(".menu-button-comments");

        if (puntos) {
            // console.log("Si hay punto: ", puntos);
            const commentContainer = puntos.closest(".main-comment") || puntos.closest(".replies");

            if (commentContainer) {
                const modal = commentContainer.querySelector(".menu-container-comment");
                if (modal) {
                    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
                }else{
                    console.log("No hay nada modal")
                }
            }
        } else {
            //? Cerrar en caso de quedar fuera de rango de item.
            const commentContainers = document.querySelectorAll(".main-comment, .replies");
            commentContainers.forEach(item => {
                let modal = item.querySelector(".menu-container-comment");
                if (modal) {
                    if(modal.style.display == "flex" && !event.target.closest(".menu-container-comment")){
                        modal.style.display = "none";
                        // console.log("modal texto: ", modal.textContent)
                    }else if(modal.style.display == "flex" && event.target.closest(".menu-container-comment")){
                        //? En caso de que se haga click dentro del item de editar, etc.
                        // console.log("modal texto: ", modal.textContent.trim())

                        //Conseguir el parrafo donde esta le texto a editar
                        const containerComment = modal.closest(".main-comment") || modal.closest(".replies");
                        
                        // console.log("Pargagraph: ", paragraph)

                        //? EDITAR COMENTARIO
                        editComment(containerComment)
                        modal.style.display = "none"
                    }
                } else {
                    console.log("no hay modal");
                }
            });
        }
    });
}
//? EDITAR...========================================================

function editComment(containerComment, event){
    const paragraph = containerComment.querySelector(".comment-content")
    const commentsActions = containerComment.querySelector(".comment-actions")
    const commentsActionsEdit = containerComment.querySelector(".comment-actions-edit")
    const btnAccept = commentsActionsEdit.querySelector("#btnAccept")
    const btnCancel = commentsActionsEdit.querySelector("#btnCancel")

    btnAccept.style.backgroundColor = "#3C3836"
    btnAccept.style.color = "#6C6C6C"
    btnAccept.style.cursor = "default"
    btnAccept.setAttribute("disabled", "")

    //Obtencion del dataset de comment.
    const headers = containerComment.querySelector(".container-headers")
    const idComment =  headers.dataset.idcomment 

    console.log("ID commnet: ", idComment)
    let pCopy = paragraph.textContent.trim()

    // Estilo de enfoque
    paragraph.setAttribute("contenteditable", "true")
    paragraph.focus();
    paragraph.style.backgroundColor = "#D7BA72"
    paragraph.style.padding = "5px"
    paragraph.style.borderRadius = "5px"
    paragraph.style.color = "#32302F"
    
    

    
    

    commentsActions.style.display = "none"
    commentsActionsEdit.style.display = "flex"

    btnAccept.addEventListener("click", async()=>{
        normalModeContent(paragraph,commentsActions,commentsActionsEdit)
        // console.log("Btn Accept clicado: ", btnAccept)
        console.log("NUEVO CONTENIDO DE COMENTARIO: ", paragraph.textContent.trim())
        const newText = paragraph.textContent.trim();
        await fetchEditComment(newText,idComment)
        
    })

    btnCancel.addEventListener("click", ()=>{
        normalModeContent(paragraph,commentsActions,commentsActionsEdit)
        paragraph.textContent = pCopy
        console.log("Btn Cancel clicado: ", btnCancel)
        // paragraph.removeEventListener("blur", handlerFocusText(paragraph))
    })


    // Quitar o aumentar restriccion de edicion a un comentario que es igual al anterior
    paragraph.addEventListener("input", changevalue)
    function changevalue(event){
        let textoTarget = event.target.textContent
        if(textoTarget.trim() !== pCopy){
            console.log(textoTarget.trim(), pCopy)
            btnAccept.removeAttribute("disabled", "")
            btnAccept.style.backgroundColor = "#D7BA72"
            btnAccept.style.color = "#32302F"
            
        }else{
            btnAccept.setAttribute("disabled", "")
            console.log(textoTarget.trim(), pCopy)
            btnAccept.style.backgroundColor = "#3C3836"
            btnAccept.style.color = "#6C6C6C"
        }
    }
}
const normalModeContent=(paragraph,commentsActions,commentsActionsEdit)=>{
    paragraph.setAttribute("contenteditable", "false")
    commentsActions.style.display = "flex"
    commentsActionsEdit.style.display = "none"
    paragraph.style.backgroundColor = "#32302F"
    paragraph.style.color = "#DFDBB2"
}

const fetchEditComment=async(newText, idComment)=>{
    console.log("datoa enviados para editar: ", newText, idComment)
    const response = await fetch("/user/comment/edit",{
        method:"PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({newText: newText, idComment: idComment}),
    })
    const data = await response.json()
    if(data.success === true){
        console.log("Exito: ", data.message, response.status)
    }else{
        console.log(data.message, response.status)
    }
    
}
