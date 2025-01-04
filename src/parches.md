````js
function gethtmlNotifications(
  typehtml,
  message,
  messageNotif,
  senderId,
  recipientId,
  notifId
) {
  const notificationsStyles = {
    firstmessage: `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="notification-icon">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 23h-24v-13.275l2-1.455v-7.27h20v7.272l2 1.453v13.275zm-20-10.472v-9.528h16v9.527l-8 5.473-8-5.472zm14-.528h-12v-1h12v1zm0-3v1h-12v-1h12zm-7-1h-5v-3h5v3zm7 0h-6v-1h6v1zm0-2h-6v-1h6v1z"/></svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Contacto desconocido</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>

            </li>`,
    youlike: `<div class="notification-item" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="avatar">O</div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <div class="notification-title">
                                <span class="status-indicator"></span>
                                ObsidianMD
                            </div>
                            <span class="notification-time">4h</span>
                        </div>
                        <div class="notification-text">
                            LifeOS Plugin Open Source Version Q4 Update
                        </div>
                    </div>
                    <div class="menu-button">⋮</div>
                </div>`,

    youlike: `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>


                    <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Nuevo Like</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>
            </li>`,

    newcontact: `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.5 17.311l-1.76-3.397-1.032.505c-1.12.543-3.4-3.91-2.305-4.497l1.042-.513-1.747-3.409-1.053.52c-3.601 1.877 2.117 12.991 5.8 11.308l1.055-.517z"/></svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Nuevo Like</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>
            </li>`,
  };

  return notificationsStyles[typehtml];
}


```html
<div class="comments-section">
    <div id="comment-container">
        <% commentariosPrincipales.forEach(comm => { %>
            <div class="comment" id="commentsTotales">
                <div class="container-headers">
                    <% if (author === comm.user_name) { %>
                        <div class="headers-content">
                            <div class="comment-author" id="comment-user-name">
                                <%= comm.user_name %>
                            </div>
                            <div class="comment-author-tag" style="color: #FCD639;">
                                <%= "(author)" %>
                            </div>
                        </div>
                    <% } else { %>
                        <div class="comment-author" id="comment-user-name">
                            <%= comm.user_name %>
                        </div>
                    <% } %>

                    <% if (comm.requestname) { %>
                        <div id="receptor-message" class="headers-content" style="color: #68985A;">
                            >> <%= comm.requestname %>
                            <% if (comm.requestname === author) { %>
                                <div id="receptor-message" style="color: #FCD639;">
                                    (author)
                                </div>
                            <% } %>
                        </div>
                    <% } %>
                </div>
                <span class="comment-date"><%= comm.date %></span>
                <p class="comment-content">
                    <%= comm.comment %>
                </p>

                <div class="comment-id sr-only" id="id-comment"><%= comm._id %></div>
                <div class="messageparent-id sr-only" id="id-messageparent"><%= comm.idmessageparent %></div>
                <div class="postid-id sr-only" id="id-postid"><%= comm.post_id %></div>
                <div class="comment-status sr-only" id="id-status"><%= comm.visible %></div>

                <div class="comment-actions">
                    <div class="likes-dislikes">
                        <button class="like-btn" aria-label="Like comment">
                            <span class="like-count">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width="25" height="25">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                  </svg>
                            </span>Me gusta
                        </button>

                        <button class="dislike-btn" aria-label="Dislike comment">
                            <span class="dislike-count">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" width="25" height="25">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                                  </svg>

                            </span>
                            No me gusta
                        </button>
                    </div>
                    <div class="btns-actions-comments">
                        <button class="reply-btn btn-comments" id="button-request">Responder</button>
                        <% if (propietario) { %>
                            <button class="hide-btn btn-comments" id="button-hide">
                                <%= comm.visible ? "Ocultar" : "Mostrar" %>
                            </button>
                            <span id="status-comment-user">
                                <%= comm.visible ? "" : "Este comentario solo es visible para ti" %>
                            </span>
                        <% } %>

                        <% if (username === comm.user_name || propietario) { %>
                            <button class="delete-btn btn-comments" id="button-delete">
                                Eliminar
                            </button>
                        <% } %>
                    </div>
                </div>

                <% if (comm.idmessageparent === "") { %>
                    <div class="btn-container" id="btn-morecomments">
                        <span style="font-size: 15px;" id="Cargar">Cargar Comentarios</span>
                        <i class="material-icons add-comment" id="arrow-requests">arrow_drop_down</i>
                    </div>
                <% } %>
                <div id="partial-request-cont"></div>
                    <div class="container-form-commentrequest">
                        <!-- Header con nombre al que se responde -->
                        <div id="request-name-header">
                            <p class="reply-to">@<span id="request-name"></span></p>
                        </div>

                        <!-- Formulario para agregar comentarios -->
                        <form id="formCommentRequest" class="comment-field v3">
                            <textarea
                                placeholder="Escribe tu respuesta aquí..."
                                id="comment-content-request"
                                name="comment"
                                style="resize: none;">
                            </textarea>

                            <!-- Acciones de enviar y cancelar -->
                            <div class="actions" style="display: flex; gap: 10px; justify-content: flex-end;">
                                <!-- Botón de cancelar -->
                                <button id="button-cancel" class="btn-comments btn-cancel" title="Cancelar">
                                    Cancelar
                                </button>

                                <!-- Botón de enviar -->
                                <button id="btn-comment-request" class="btn-submit" title="Enviar">
                                    Enviar
                                </button>
                            </div>
                        </form>

                        <!-- Aviso para el estado del comentario -->
                        <span id="aviso-comment" style="color: red; margin-top: 5px;"></span>
                    </div>
            </div>
        <% }) %>
    </div>
</div>
````

```css
/* PARTE DE COMMENTS */

.light-mode .comment-form textarea {
  background-color: var(--light-bg);
  color: var(--light-fg);
  border-color: var(--light-border);
}

.comment-list {
  list-style-type: none;
  padding: 0;
}

.comment {
  background-color: var(--dark-bg-muted);
  border: 1px solid var(--dark-border);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}

.light-mode .comment {
  background-color: var(--light-bg-muted);
  border-color: var(--light-border);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
  color: var(--dark-primary);
}

.light-mode .comment-author {
  color: var(--light-primary);
}

.comment-date {
  color: var(--dark-secondary);
  font-size: 0.9em;
}

.light-mode .comment-date {
  color: var(--light-secondary);
}

#theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: var(--dark-primary);
  color: var(--dark-bg);
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.light-mode #theme-toggle {
  background-color: var(--light-primary);
  color: var(--light-bg);
}
/* Estado oculto */
.comment[data-visible="false"] {
  opacity: 0.7;
  background-color: #f7fafc;
  border-style: dashed;
}

/* Animación sutil para los botones */
.btn-comments {
  position: relative;
  overflow: hidden;
  margin: 10px;
  font-family: "Times New Roman", serif;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.sr-only {
  display: none;
}
.btns-actions-comments {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}

/*MODAL DE REGISTRO DE USUARIO EN COMENTARIOS*/
.modal {
  display: none; /* Ocultar el modal por defecto */
  position: fixed; /* Posicionarlo en la ventana */
  z-index: 1; /* Por encima de otros elementos */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* Habilitar scroll si es necesario */
  background-color: rgba(0, 0, 0, 0.4); /* Fondo oscuro semitransparente */
}
.modal-content {
  background-color: #fff;
  margin: 15% auto; /* Centrando el modal */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Ancho del modal */
  border-radius: 15px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

/* Parte de respuestas a comentarios */

.headers-content {
  display: flex;
}
.container-headers {
  display: flex;
}
.comment-field {
  background-color: var(--dark-bg-soft);
  border: 1px solid var(--dark-bg-muted);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  max-width: 600px;
}

textarea {
  width: 100%;
  min-height: 100px;
  background-color: #282828;
  border: 1px solid var(#282828);
  border-radius: 4px;
  color: var(--dark-fg);
  padding: 0.75rem;
  margin: 0.5rem 0;
  resize: vertical;
  transition: border-color 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: var(--dark-blue);
  box-shadow: 0 0 0 2px rgba(69, 133, 136, 0.2);
}

.username {
  color: var(--dark-yellow);
  font-weight: 500;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: transparent;
  color: var(--dark-red);
  border: 1px solid var(--dark-red);
}

.btn-submit {
  background-color: var(--dark-aqua);
  color: var(--dark-bg);
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.container-form-commentrequest {
  display: none; /* Muestra o oculta según sea necesario */
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
  margin: auto;
}

.v3 {
  background-color: transparent;
  border: none;
}

.v3 .reply-to {
  color: var(--dark-yellow);
  font-size: 0.875rem;
}

.v3 textarea {
  border: none;
  border-bottom: 2px solid var(--dark-bg-muted);
  border-radius: 0;
}

/* Parte de las interacciones */
.interactions-row {
  display: flex;
  justify-content: start;
  align-items: center;
  text-align: center;
}
.individual-interactions {
  display: flex;
  width: 6rem;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  border-radius: 9px;
  padding: 8px;
  margin-right: 13px;
  cursor: pointer;
  border-color: #1a365d;
  border-style: solid;
}
.individual-interactions:hover {
  border-color: #fcd639;
  border-style: solid;
}

.add-like,
.add-dislike,
.add-share,
#like-count,
#dislike-count,
#share-count {
  color: #1a365d;
}

#add-like:hover .add-like,
#add-dislike:hover .add-dislike,
#add-share:hover .add-share {
  color: #fcd639;
}

#add-like:hover #like-count,
#add-dislike:hover #dislike-count,
#add-share:hover #share-count {
  color: #fcd639;
}

/*! Cuando se ha guardado la  interaccion */
.active-button {
  background-color: #1a365d;
}

.active-text {
  color: #fcd639;
}

#like-count.active-count,
#dislike-count.active-count,
#share-count.active-count {
  color: #fcd639;
}
```
