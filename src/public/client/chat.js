import { getHtmlAnnounces } from "./html-codes.js";

export function initChat() {
    console.log("INICIANDO MODULOS DE CHAT");

    const socket = initializeSocket();
    const domElements = cacheDOMElements();

    searchUser(socket, domElements);
    // showNotifications(socket, domElements);
    showChatPrivado(socket, domElements);
    showChatInterfaz(domElements)
}


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
        notifContainer: document.querySelector(".notifications-container"),
        chatIcon : document.querySelector(".chat-icon"),
        chatContainer: document.getElementById("chat-container"),
        btnClose: document.querySelector(".btn-close"),
        chatContactsPending: document.querySelector(".chat-contacts-pending")
    };
}

function showChatInterfaz(domElements){
    const {chatIcon, chatContainer, btnClose } = domElements;
    chatIcon.addEventListener("click", ()=>{
        chatContainer.style.display = "flex"
        console.log("Chat puede verse")
    })

    btnClose.addEventListener("click", ()=>{
        chatContainer.style.display = "none"
        console.log("Chat oculto")
    })
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
            console.log("DESDE STARCHAT NEWCONTACT: ", idContact, usernameContact);
            socket.emit("startchat newcontact", idContact, usernameContact);
        });
    });
}

// Configuración de notificaciones
// function showNotifications(socket, domElements) {
//     const { notifContainer } = domElements;

//     socket.on("connect", () => {
//         console.log("Conectado al servidor");
//         socket.emit("recover notifications");
//     });

//     socket.on("show notifications", (notifications) => {
//         console.log("Notificaciones: ", notifications);
//     });

//     notifContainer.addEventListener("click", () => {
//         console.log("Notificaciones clicadas");
//     });
// }

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
                socket.emit("startprivatechat", userId, nombre);
            });

            chatContacts.appendChild(userItem);
        });
    });

    
    socket.on("privateChatStarted", (data) => {
        const usernameHeader = document.querySelector("#user_name");
        console.log("Data: ", data);
        usernameHeader.textContent = data.contactname;
        console.log("SE EMITIO EL NOMBRE DE CONTACTO Y SENDER e2e2: ", data.idSender, data.username, data.room, data.contactname);
        chatMessages.innerHTML = "";
        chatMessages.dataset.userId = data.room;
        console.log("ROOM CREADO: ", data.room);
        socket.roomName = data.room;

        // Define la función de manejo del evento submit
        function handleFormSubmit(event) {
            event.preventDefault();
            
            if (chatInput.value.trim()) {
                socket.emit("privateMessage", { roomName: data.room, message: chatInput.value, nameContact: data.contactname, sendername: data.username, idContact: data.idContact });
                chatInput.value = "";
                console.log("DESDE FORM ENVIO DE MENSAJE: ", { roomName: data.room, message: chatInput.value, nameContact: data.contactname, sendername: data.username, idContact: data.idContact });
            }
        }

        // Elimina cualquier evento submit anterior
        formChat.removeEventListener("submit", formChat.handleFormSubmit);

        // Asigna la nueva función de manejo del evento submit
        formChat.handleFormSubmit = handleFormSubmit;

        // Agrega el nuevo evento submit
        formChat.addEventListener("submit", formChat.handleFormSubmit);

        console.log("ROOM DESDE PRIVATE MESSAGE: ", data.room);

        socket.emit("recoverMessages", data.room, data.contactname, data.username, data.idContact);
        console.log("SE EMITIO EL NOMBRE DE CONTACTO Y SENDER: ", data.contactname, data.username, data.idContact);
    });

    socket.on("sendMessage", (data) => {
        console.log("ROOM DESDE SENDEMESSAGE: ", chatMessages.dataset.userId, data.roomName, data)
        if (chatMessages.dataset.userId === data.roomName) {
            console.log("SIE ES EL ROOM Y SE ENVIO: ", chatMessages.dataset.userId, data.roomName, data)
            const messageItem = document.createElement("div");
            const usernameHeader = document.querySelector("#user_name");

            if(usernameHeader.textContent.trim() !== data.nameContact){
                console.log("CONTACTO: ", data.userid, data.senderId, data.message, true)
                messageItem.innerHTML = `<div class="message received">
                                         <span class="sender">De ${data.sendername}:</span>
                                        <p>${data.message}</p>
                                    </div>`;
            }else{
                console.log("SENDER: ", data.userid, data.senderId, data.message)
                messageItem.innerHTML = `<div class="message sent">
                                        <span class="sender">Tú:</span>
                                        <p>${data.message}</p>
                                    </div>`;
            }
            
            chatMessages.appendChild(messageItem);
            messageItem.scrollIntoView({ behavior: "smooth", block: "start" });
        }else{
            console.log("No es el room: ", data)
        }
    });

    socket.on("recoveredMessages", (userid,messages, usernameContact, sendername, contactId, isFirstMessage) => {
        chatMessages.innerHTML = "";
        console.log("Sender Id", messages[0].senderId)
        let senderIdMessage = messages[0].senderId
        messages.forEach(({content, senderId }) => {
            // console.log("NOmbres de contacto y sender: ",messages, usernameContact, sendername)
            const messageItem = document.createElement("div");
            const usernameHeader = document.querySelector("#user_name");
            if( userid != senderId){
                console.log(userid, senderId)
                messageItem.innerHTML = `<div class="message received">
                                        <span class="sender">De ${usernameContact}:</span>
                                        <p>${content}</p>
                                    </div>`;
            }else{
                messageItem.innerHTML = `<div class="message sent">
                                        <span class="sender">Tú:</span>
                                        <p>${content}</p>
                                    </div>`;
            }

            chatMessages.appendChild(messageItem)
            
        });

        //Intento avisarle al receptor de un mensaje nuevo si acepta seguir recibiendo mensaje
        if(isFirstMessage == true && userid != senderIdMessage){
            chatInput.disabled = true
            const confirmNode = document.createElement("div");
            // extraer html del anuncio
            confirmNode.innerHTML = getHtmlAnnounces("confirmNewContact", usernameContact, contactId, sendername, userid);
            // confirmNode.dataset.id = contactId
            chatMessages.appendChild(confirmNode);


            // MAnejar evento para botonoe
            const btnaccept = document.querySelector(".btn-accept");
            //! Pasar contacto a accept
            btnaccept.addEventListener("click", ()=>{
                console.log("Presionaste aceptar: ", senderIdMessage, contactId)

                //! EVENTO PARA PASAR DATO DE CONTACT Y ACEPTAR
                socket.emit("accept contact", userid, contactId, "accepted")
            })

            document.querySelector(".btn-ignore").addEventListener("click", ()=>{
                console.log("Presionaste ignorar")
            })

        }




        const lastItem = chatMessages.lastElementChild;
        if (lastItem) {
            lastItem.scrollIntoView({ behavior: "instant", block: "start" });
        }
    });



    socket.on("getPendingContact", (userContacts)=>{
        console.log("CONTACTOS OBTENIDOS EN TUIEMPO REAL: ", userContacts)
        const { chatContactsPending } = domElements;
        chatContactsPending.innerHTML = "";
        userContacts.forEach(contact=>{
            console.log("Nombre de contacto: ", contact.contact_id.user_name)

            const contactName = contact.contact_id.user_name;
            const contactId = contact.contact_id._id;

            const userItem = document.createElement("li");
            userItem.classList.add("contacto");
            userItem.textContent = contactName;
            userItem.dataset.userId = contactId;

            userItem.addEventListener("click", () => {
                console.log(`Iniciando chat con ${contactName} (${contactId})`);
                socket.emit("startchat newcontact", contactId, contactName);
            });
            
            chatContactsPending.appendChild(userItem);
        })
    })

    socket.on("recover contacts", (userContacts)=>{
        console.log("CONTACTOS OBTENIDOS: ", userContacts)
        const { chatContactsPending } = domElements;
        chatContactsPending.innerHTML = "";
        userContacts.forEach(contact=>{
            console.log("Nombre de contacto: ", contact.contact_id.user_name)

            const contactName = contact.contact_id.user_name;
            const contactId = contact.contact_id._id;

            const userItem = document.createElement("li");
            userItem.classList.add("contacto");
            userItem.textContent = contactName;
            userItem.dataset.userId = contactId;

            userItem.addEventListener("click", () => {
                console.log(`Iniciando chat con ${contactName} (${contactId})`);
                socket.emit("startchat newcontact", contactId, contactName);
            });
            
            chatContactsPending.appendChild(userItem);
        })
    })

    
    //? HANDLERS DE BOTONES DE CONFIRMACION
    // function handlerAccept(socket, contactId, senderId){

    // }
    
}
