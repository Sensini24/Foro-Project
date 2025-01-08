import { getHtmlAnnounces } from "./html-codes.js";

export function initChat() {
    console.log("INICIANDO MODULOS DE CHAT");

    
    const domElements = cacheDOMElements();
    
    const socket = initializeSocket();
    // const usercurrent = getUserCurrent(socket);
    console.log("si esxite usuario")
    // searchUser(socket, domElements);
    // showNotifications(socket, domElements);
    showChatPrivado(socket, domElements);
    showChatInterfaz(domElements)
    closeChat(domElements)

    //? Elementos dentro del chat
    showStartChat(domElements)
    showSearchUser(socket, domElements)
}


function initializeSocket() {
    
    return io({
        auth: {
            serverOffset: 0
        }
    });
}

function getUserCurrent(socket){
    socket.on("sendToken", (usuario)=>{
        console.log("USUARIO CONECTADO: ", usuario)
        return usuario.socketid;
    })
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
        chatContactsPending: document.querySelector(".chat-contacts-pending"),
        chatConfirmation: document.querySelector(".chat-confirmation"),
        chatContactsContacts: document.querySelector(".chat-contacts-contacts"),
        btnStartChat: document.querySelector(".btn-start-chat"),
        startChatBtn: document.querySelector(".start-chat-btn"),

        searchInputChat: document.querySelector(".search-input-chat"),
        formSearchChat: document.querySelector(".form-search-user-chat"),
        searchResults: document.querySelector(".search-results")

    };
}

function showChatInterfaz(domElements){
    const {chatIcon, chatContainer, btnClose } = domElements;
    if(chatIcon){
        chatIcon.addEventListener("click", ()=>{
            chatContainer.style.display = "flex"
            console.log("Chat puede verse")
        })

        btnClose.addEventListener("click", ()=>{
            chatContainer.style.display = "none"
            console.log("Chat oculto")
        })
    }
    

    
}

// // Configuración de la búsqueda de usuarios
// function searchUser(socket, domElements) {
//     const { formSearch, inputSearch, suggestionsList } = domElements;

//     if(formSearch){
//         formSearch.addEventListener("submit", async (event) => {
//             event.preventDefault();
//             const username = inputSearch.value;
//             if (!username) {
//                 console.log("Escribe el nombre de un usuario");
//                 return;
//             }
    
//             try {
//                 const response = await fetch(`/user/findUsers/${username}`);
//                 const users = await response.json();
    
//                 suggestionsList.innerHTML = "";
//                 users.forEach(user => {
//                     const li = document.createElement("li");
//                     li.textContent = user.user_name;
//                     li.dataset.userId = user._id;
//                     li.classList.add("new-contact");
//                     suggestionsList.appendChild(li);
//                 });
    
//                 newDataContact(socket);
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//             }
//         });
//     }
    
// }



// Adjuntar eventos a nuevos contactos
function newDataContact(socket) {
    const newContacts = document.querySelectorAll("li.new-contact");
    newContacts.forEach(contact => {
        contact.addEventListener("click", () => {
            const idContact = contact.dataset.userId;
            const usernameContact = contact.textContent.trim();
            console.log("DESDE STARCHAT NEWCONTACT: ", idContact, usernameContact);

            //? ESTE EVENTO SE RECICLA PARA ENVIA INFO AL SERVIDOR Y CREAR UN ROOM E INICIAR UN CHAT PRIVADO.
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
    const { formChat, chatInput, chatMessages, chatContacts, chatConfirmation } = domElements;

    socket.on("users connected", (connectedUsers, currentUserId) => {
        chatContacts.innerHTML = "";
        connectedUsers.forEach(([userId, { nombre }]) => {
            const userItem = document.createElement("li");
            userItem.classList.add("contacto");
            userItem.textContent = nombre;
            userItem.dataset.userId = userId;

            userItem.addEventListener("click", () => {
                console.log(`Iniciando chat con ${nombre} (${userId})`);

                //? SOLO ENVIA LA INFO DEL USUARIO CLICADO Y CUANDO OYE EL EVENTO EN SERVIDOR CREA UN ROOM CON ESOS DATOS.
                socket.emit("startprivatechat", userId, nombre);
            });

            chatContacts.appendChild(userItem);
        });
    });

    //? YA CREADO EL ROOM SE ENVIA LOS DATOS DE ESTE CON LOS OTROS PARA CREAR EL ESPACIO DE CARGA DE MENSAJES
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
            }else{
                console.log("Escribe un mensaje")
                return console.log("Escribe un mensaje")
            }
        }

        //! EN CASO DE QUE EXISTE EL FORM DE ENVIO DE MENSAJE
        if(formChat){
            // Elimina cualquier evento submit anterior
            formChat.removeEventListener("submit", formChat.handleFormSubmit);

            // Asigna la nueva función de manejo del evento submit
            formChat.handleFormSubmit = handleFormSubmit;

            // Agrega el nuevo evento submit
            formChat.addEventListener("submit", formChat.handleFormSubmit);

            console.log("ROOM DESDE PRIVATE MESSAGE: ", data.room);

            //? CREA EL EVENTO QUE ENVIA INFO A SERVIDOR PARA RECOBRAR MENSAJES
            socket.emit("recoverMessages", data.room, data.contactname, data.username, data.idContact);
            console.log("SE EMITIO EL NOMBRE DE CONTACTO Y SENDER: ", data.contactname, data.username, data.idContact);
        }
        
    });

    //? RECIBE LOS MENSAJE DE SERVIDOR CON EVENTO privateMessage Y LO CARGA AL ROOM O INTERFAZ CREADO.
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


    //? RECOBRA LOS MENSAJE DESDE SERVIDOR
    socket.on("recoveredMessages", (userid, messages, usernameContact, sendername, contactId, isFirstMessage, contactState) => {
        chatMessages.innerHTML = "";
        console.log("Sender Id", messages[0].senderId);
        const senderIdMessage = messages[0].senderId;
    
        // Función para crear y añadir mensajes al chat
        const addMessage = (content, senderId) => {
            const messageItem = document.createElement("div");
            const isReceived = userid !== senderId;
            messageItem.innerHTML = `<div class="message ${isReceived ? 'received' : 'sent'}">
                                        <span class="sender">${isReceived ? `De ${usernameContact}:` : 'Tú:'}</span>
                                        <p>${content}</p>
                                    </div>`;
            chatMessages.appendChild(messageItem);
        };
    
        // Añadir mensajes al chat
        messages.forEach(({ content, senderId }) => {
            addMessage(content, senderId);
        });
    
        //? EN CASO DE QUE EL ID DEL USUARIO ACTUAL SEA DIFERENTE AL DEL QUE ENVIO EL MENSAJE, Y SI SOLO SON MENSAJES DE UN USUARIO, ADEMAS DE QUE SEA EL CONTACTO DE ESTADO PENDING, ENTONCES LE SALE LA INTERFAZ DE CONFIRMACION DE CONTACTO.
        console.log("sendeid: ", senderIdMessage, "userid: ", userid, contactState )
        if (isFirstMessage && userid !== senderIdMessage && contactState == "pending") {
           
            chatInput.disabled = true;
            const confirmNode = document.createElement("div");
            confirmNode.innerHTML = getHtmlAnnounces("confirmNewContact", usernameContact, contactId, sendername, userid);
            chatMessages.appendChild(confirmNode);
    
            // Manejar eventos de botones
            const btnAccept = confirmNode.querySelector(".btn-accept");
            const btnIgnore = confirmNode.querySelector(".btn-ignore");
    
            btnAccept.addEventListener("click", () => {
                console.log("Presionaste aceptar:", senderIdMessage, contactId);

                //? Emitir evento para aceptar contacto
                socket.emit("accept contact", userid, contactId, "accepted");
            });
    
            btnIgnore.addEventListener("click", () => {
                console.log("Presionaste ignorar");
                // Aquí puedes añadir lógica para ignorar el contacto
            });
        }
    
        // Desplazar a la vista el último mensaje
        const lastItem = chatMessages.lastElementChild;
        if (lastItem) {
            lastItem.scrollIntoView({ behavior: "instant", block: "start" });
        }
    });
    


    socket.on("getPendingContact", (userContacts)=>{
        // console.log("CONTACTOS OBTENIDOS EN TUIEMPO REAL: ", userContacts)
        const { chatContactsPending } = domElements;
        chatContactsPending.innerHTML = "";
        userContacts.forEach(contact=>{
            console.log("Nombre de contacto: ", contact.contact_id.user_name)
            const contactName = contact.contact_id.user_name;
            const contactId = contact.contact_id._id;

            addAndStarChat(chatContactsPending, contactName, contactId)
        })
    })

    socket.on("recover contacts", (userContacts)=>{
        // console.log("CONTACTOS OBTENIDOS: ", userContacts)
        const { chatContactsPending, chatContactsContacts } = domElements;
        chatContactsPending.innerHTML = "";
        // const contactPendings = userContacts.filter(contact => contact.estado == "pending");
        userContacts.forEach(contact=>{
            console.log("Nombre de contacto: ", contact.contact_id.user_name)

            const contactName = contact.contact_id.user_name;
            const contactId = contact.contact_id._id;
            const contactEstado = contact.estado;

            if(contactEstado == "pending"){
                addAndStarChat(chatContactsPending,contactName, contactId)
            }else if(contactEstado == "accepted"){
                addAndStarChat(chatContactsContacts,contactName, contactId)
            }
            
        })
    })

    function addAndStarChat(arrayContactStado, contactName, contactId){
        const userItem = document.createElement("li");
        userItem.classList.add("contacto");
        userItem.textContent = contactName;
        userItem.dataset.userId = contactId;
        arrayContactStado.appendChild(userItem);
        console.log("Contacto agregado a panel de chat: ", contactName)

        
        userItem.addEventListener("click", () => {
            let allcontact = document.querySelectorAll(".contacto")
            allcontact.forEach(contact=>contact.classList.remove("active"))
            userItem.classList.add("active")
            console.log(`Iniciando chat con ${contactName} (${contactId})`);

            //? AQUI CUANDO SE AGREGA EL CONTACTO YA SEA PENDING O ACCEPTED SE ENVIA
            //? LA INFO PARA CREAR EL ROOM Y LO DEMAS DE RECUPERACION DE MENSAJES.
            socket.emit("startchat newcontact", contactId, contactName);
        });
    }

    //? SI EL USUARIO ACEPTA AL NUEVO CONTACTO SE ELIMINAN LAS LIMITACIONES
    socket.on("notification new contact", (isAccepted)=>{
        if(isAccepted){
            const announceConfirm = document.querySelector(".chat-confirmation")
            console.log(announceConfirm);
            console.log(isAccepted);
            chatInput.disabled = false;
            announceConfirm.remove()
            
        }
    })
    
    //? HANDLERS DE BOTONES DE CONFIRMACION
    // function handlerAccept(socket, contactId, senderId){

    // }

    
    
    
}
//?CIERRA CHAT AL INTERACTUAR FUERA DE ESTE
const closeChat=(domElements)=>{
    const{chatContainer} = domElements
    document.addEventListener("click", (event)=>{
        const target = event.target.closest(".chat-container, .chat-icon, .start-chat-btn")
        if(!target){
            console.log("NO HAY NADA DE CHAT")
            chatContainer.style.display = "none"
        }
        
    })
    
}

//?Mostrar la pantalla de iniciar chat
const showStartChat = (domElements)=>{
    const {btnStartChat, chatMessages} = domElements;
    btnStartChat.addEventListener("click", async()=>{
        chatMessages.innerHTML = "";
        try {
            const response = await fetch('/partial-menuChat');
            const partialHtml = await response.text(); 
            chatMessages.innerHTML = ""
            chatMessages.innerHTML = partialHtml; 
        } catch (error) {
            console.error('Error cargando el parcial:', error);
        }
    })
}

//?Mostrar la pantalla de iniciar chat
const showSearchUser = (socket, domElements)=>{
    const {chatMessages, chatContainer} = domElements;

    chatContainer.addEventListener("click", async(event)=>{
        const startChatBtn = event.target.closest(".start-chat-btn")
        if(startChatBtn){
            chatMessages.innerHTML = "";
            try {
                const response = await fetch('/partial-SearchUserChat');
                const partialHtml = await response.text();
                chatMessages.innerHTML = ""
                chatMessages.innerHTML = partialHtml; 

                searchUser(socket, domElements)
            } catch (error) {
                console.error('Error cargando el parcial:', error);
            }
        }

        
    })
}

// Configuración de la búsqueda de usuarios en chat
function searchUser(socket, domElements) {
    // const { formSearchChat, searchInputChat, searchResults } = domElements;
    const searchInputChat =  document.querySelector(".search-input-chat")
    const formSearchChat = document.querySelector(".form-search-user-chat")
    const searchResults =  document.querySelector(".search-results")
    // console.log("form searc: ", formSearchChat)
    // console.log("search input: ", searchInputChat)
    // console.log("search results: ", searchResults)

    if(formSearchChat){
        formSearchChat.addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = searchInputChat.value;
            if (!username) {
                console.log("Escribe el nombre de un usuario");
                return;
            }
    
            try {
                const response = await fetch(`/user/findUsers/${username}`);
                const users = await response.json();
    
                if(users){
                    let user_name = users.user_name;
                    let profilePic = users.profilePic
                    searchResults.innerHTML = ""
                    users.forEach(user => {
                        // const li = document.createElement("li");
                        let userFind = `<div class="user-item-chat">
                                            <div class="user-avatar-chat">JP</div>
                                            <div class="user-info-chat">
                                                <div class="user-name-chat">${user.user_name}</div>
                                                <div class="user-status-chat">
                                                    <span class="status-indicator status-online"></span>
                                                    En línea
                                                </div>
                                            </div>
                                            <button class="chat-button">Iniciar chat</button>
                                        </div>`
                        // searchResults.appendChild(userFind);
                        searchResults.innerHTML += userFind
                    });
                }
                // searchResults.innerHTML = "";
                
    
                newDataContact(socket);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        });
    }
    
}