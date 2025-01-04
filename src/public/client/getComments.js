// Importaciones necesarias
import { convertDate } from "./notificationclient.js";

// Inicialización del sistema
export async function initCommentsModule() {
    const socket = initializeSocket();
    const domElements = getDomElements();
    handlerCommentSocket(socket);
    await renderComments(domElements);
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
        commentContainer: document.getElementById("comment-container")
    };
}

// Renderizar comentarios en la interfaz
async function renderComments(domElements) {
    // const {partialContainer} = domElements;
    const postId = getPostId();
    const partialContainer = document.getElementById("partial-container");

    try {
        const response = await fetch(`/comments/request/${postId}`);
        const commentsHtml = await response.text();
        partialContainer.innerHTML = commentsHtml;

        attachCommentEventListeners();
        convertDate(getDomElements());
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
    const actionButtons = comment.querySelector(".comment-actions");
    const authorName = comment.querySelector(".comment-author")?.textContent.trim();

    formContainer.style.display = "block";
    actionButtons.style.display = "none";
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
            convertDate(getDomElements());
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

        if (response.ok) {
            console.log("Comentario creado con éxito");
            document.getElementById("partial-container").value = "";
            await renderComments();
            await sendMessageSocket(socket, postId,authorPost, namePost, inputComment)
        } else {
            console.error("Error al crear el comentario");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function sendMessageSocket(socket, postId,nameuser, namePost, comment){
    socket.emit("messageNotification", postId,nameuser, namePost, comment )
}

