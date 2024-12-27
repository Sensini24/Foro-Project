export function getHtmlAnnounces(type, usernameContact, contactId, sendername, userid){
    const announces = {
        confirmNewContact :`<div class="chat-confirmation">
            <div class="chat-icon-contact">💬</div>
            <p class="chat-message">¿Aceptas conversar con este usuario o prefieres ignorarlo?</p>
            <div class="chat-user">
                <div class="user-avatar">JD</div>
                <div class="user-info">
                    <div class="user-name">MI nombre: ${usernameContact}</div>
                    <div class="user-name">Mi Id: ${contactId}</div>
                    <div class="user-status">Usuario nuevo</div>
                </div>
            </div>
            <div class="chat-actions">
                <button class="btn btn-accept">Aceptar</button>
                <button class="btn btn-ignore">Ignorar</button>
            </div>
        </div>`
    }

    return announces[type]
}
