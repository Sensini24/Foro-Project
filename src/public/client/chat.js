// Módulo principal para inicializar el chat
export function initChat() {
    console.log("INICIANDO MODULOS DE CHAT");

    const socket = initializeSocket();
    const domElements = cacheDOMElements();

    searchUser(socket, domElements);
    showNotifications(socket, domElements);
    showChatPrivado(socket, domElements);
}

// Inicializar socket.io con autenticación
function initializeSocket() {
    return io({
        auth: {
            serverOffset: 0
        }
    });
}

// caché usados en diferentes funciones reutilizables
function cacheDOMElements() {
    return {
        chatInput: document.querySelector("#input-chat"),
        formChat: document.querySelector("#form-chat"),
        formSearch: document.querySelector("#form-search-user"),
        inputSearch: document.querySelector("#input-search-user"),
        suggestionsList: document.querySelector("#sugestionList"),
        chatMessages: document.querySelector(".chat-messages"),
        chatContacts: document.querySelector(".chat-contacts"),
        notifContainer: document.querySelector(".notifications-container")
    };
}

// Configuración de la búsqueda de usuarios
function searchUser(socket, domElements) {
    const { formSearch, inputSearch, suggestionsList } = domElements;

    formSearch.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = inputSearch.value;
        if (!username) {
            console.log("Escribe el nombre de un usuario");
            return;
        }

        try {
            const response = await fetch(`/user/findUsers/${username}`);
            const users = await response.json();

            suggestionsList.innerHTML = "";
            users.forEach(user => {
                const li = document.createElement("li");
                li.textContent = user.user_name;
                li.dataset.userId = user._id;
                li.classList.add("new-contact");
                suggestionsList.appendChild(li);
            });

            newDataContact(socket);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    });
}

// Adjuntar eventos a nuevos contactos
function newDataContact(socket) {
    const newContacts = document.querySelectorAll("li.new-contact");
    newContacts.forEach(contact => {
        contact.addEventListener("click", () => {
            const idContact = contact.dataset.userId;
            const usernameContact = contact.textContent.trim();
            console.log(idContact, usernameContact);
            socket.emit("startchat newcontact", idContact, usernameContact);
        });
    });
}

// Configuración de notificaciones
function showNotifications(socket, domElements) {
    const { notifContainer } = domElements;

    socket.on("connect", () => {
        console.log("Conectado al servidor");
        socket.emit("recover notifications");
    });

    socket.on("show notifications", (notifications) => {
        console.log("Notificaciones: ", notifications);
    });

    notifContainer.addEventListener("click", () => {
        console.log("Notificaciones clicadas");
    });
}

// Configuración del chat privado
function showChatPrivado(socket, domElements) {
    const { formChat, chatInput, chatMessages, chatContacts } = domElements;

    socket.on("users connected", (connectedUsers, currentUserId) => {
        chatContacts.innerHTML = "";
        connectedUsers.forEach(([userId, { nombre }]) => {
            const userItem = document.createElement("li");
            userItem.classList.add("contacto");
            userItem.textContent = nombre;
            userItem.dataset.userId = userId;

            userItem.addEventListener("click", () => {
                console.log(`Iniciando chat con ${nombre} (${userId})`);
                socket.emit("startprivatechat", userId);
            });

            chatContacts.appendChild(userItem);
        });
    });

    socket.on("privateChatStarted", (recipient, roomName, usernameContact) => {
        const usernameHeader = document.querySelector("#user_name");
        usernameHeader.textContent = usernameContact;

        chatMessages.innerHTML = "";
        chatMessages.dataset.userId = roomName;
        socket.roomName = roomName;

        formChat.addEventListener("submit", (event) => {
            event.preventDefault();
            if (chatInput.value.trim()) {
                socket.emit("privateMessage", { roomName: roomName, message: chatInput.value });
                chatInput.value = "";
            }
        });

        socket.emit("recoverMessages", roomName);
    });

    socket.on("sendMessage", (data) => {
        if (chatMessages.dataset.userId === data.roomName) {
            const messageItem = document.createElement("div");
            messageItem.innerHTML = `<div class="message received">
                                        <span class="sender">De ${data.sender}:</span>
                                        <p>${data.message}</p>
                                    </div>`;
            chatMessages.appendChild(messageItem);
            messageItem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    socket.on("recoveredMessages", (messages) => {
        chatMessages.innerHTML = "";
        messages.forEach(({ sender, content }) => {
            const messageItem = document.createElement("div");
            messageItem.innerHTML = `<div class="message received">
                                        <span class="sender">De ${sender}:</span>
                                        <p>${content}</p>
                                    </div>`;
            chatMessages.appendChild(messageItem);
        });

        const lastItem = chatMessages.lastElementChild;
        if (lastItem) {
            lastItem.scrollIntoView({ behavior: "instant", block: "start" });
        }
    });
}
