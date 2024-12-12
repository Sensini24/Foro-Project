
export function initChat (){
    console.log("INICIANDO MODULOS DE CHAT")
    const chatinput = document.querySelector("#input-chat")
    const formChat = document.querySelector("#form-chat")

    // // Obtener el token de la cookie
    // function getCookie(name) {
    //     const cookies = document.cookie.split("; ");
    //     for (let cookie of cookies) {
    //         const [key, value] = cookie.split("=");
    //         if (key === name) {
    //             return decodeURIComponent(value);
    //         }
    //     }
    //     return null; // Si no se encuentra la cookie
    // }


    // const token = getCookie('authToken');
    // console.log("token cliente: ", typeof token)
    const socket = io({
        auth: {
            serverOffset: 0,
            roomid: ""
          }
    });

    // AGREGAR BUSQUEDA DE USUARIO
    const formSearch = document.querySelector("#form-search-user");
    let inputSearch = document.querySelector("#input-search-user")
    const suggestionsList = document.querySelector("#sugestionList")
    formSearch.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        const username = inputSearch.value; 
        if (!username) {
            console.log("Username cannot be empty");
            return;
        }
        try {
            const response = await fetch(`/user/findUsers/${username}`);
            
            const data = await response.json();
            suggestionsList.innerHTML = "";
            
            // Mostrar usuarios encontrados
            data.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.user_name;
                li.dataset.userId = user._id;
                li.classList.add("new-contact")
                suggestionsList.appendChild(li);

                sendContact();
            });
            console.log("data: ", data)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
    });

    function sendContact(){
        const listnewContacts = document.querySelectorAll("li.new-contact")
        console.log(listnewContacts)
        listnewContacts.forEach(contact =>{
            contact.addEventListener("click", ()=>{
                const idContact = contact.dataset.userId
                const usernamecontact = contact.textContent.trim()
                console.log(idContact, usernamecontact)
                //Creo evento para pasar el id del contacto y quizas el nombre para crear room 
                socket.emit("startchat newcontact", idContact, usernamecontact)
            });
        })
    }


    

    
    // formChat.addEventListener("submit", (event)=>{
    //     event.preventDefault()
    //     if(chatinput.value){
    //         socket.emit("chat message", chatinput.value)
    //         const item = `<div class="message received">
    //                                     <span class="sender">Me:</span>
    //                                     <p>${chatinput.value}</p>
    //                                 </div>`;
    //     chatMessages.appendChild(item);
    //         console.log("Chat enviado")
    //     }
    // })

    // Manejar eventos
    socket.on('connect', () => {
        console.log('Conectado al servidor aaaaaa');
    });

    const chatMessages = document.querySelector(".chat-messages")
    const chatContacts = document.querySelector(".chat-contacts")
    const contactos = document.querySelectorAll(".contacto")
    // socket.on("chat message", (msg, ultimoId, nombre)=>{
    //     console.log("Usuario nombnre: ", nombre)
    //     const item = `<div class="message received">
    //                                     <span class="sender">${nombre}:</span>
    //                                     querySelector<p>${msg}</p>
    //                                 </div>`;
    //     chatMessages.innerHTML += item;
    //     window.scrollTo(0, document.body.scrollHeight)
    //     socket.auth.serverOffset = ultimoId;
    // })



    

    socket.on("users connected", (usuariosConectados, currentUserId) => {

        chatContacts.innerHTML = "";

        usuariosConectados.forEach(element => {
            let nombre = element[1].nombre;
            let userIdRecip = element[0];
            
                
            // if(userIdRecip !== currentUserId){
                const userItem = document.createElement("li");
                userItem.classList.add("contacto");
                userItem.textContent = nombre;
                userItem.dataset.userId = userIdRecip;
                chatContacts.appendChild(userItem);
                
                
                userItem.addEventListener("click", (e) => {
                    e.preventDefault();
                    console.log(`Iniciando chat con ${nombre} (${userIdRecip})`);
                    socket.emit("startprivatechat", userIdRecip);
                });
            // }
                
        });
    });
    

    

    socket.on("privateChatStarted", (recipiente, roomName, usernameContact)=>{
        const usernameHeader = document.querySelector("#user_name")
        const contactslist = document.querySelectorAll("li.contacto");
            // console.log("ELEMENTO CONTACTOS PRIVATE: ", chatContacts);
        
        //const arraylist = Array.from(contactslist);
        // arraylist.forEach(elemento=>{
        //     console.log("elementos: ",elemento.getAttribute('data-user-id'));
        //     const dataId = elemento.getAttribute('data-user-id')
        //     if(dataId === recipiente){
        //         elemento.innerHTML += "hola" 
        //     }
        // })
        // chatContacts.innerHTML =""
        // const userItem = document.createElement("li");
        // userItem.classList.add("contacto");
        // userItem.textContent = usernameContact;
        // userItem.dataset.userId = recipiente;
        // chatContacts.appendChild(userItem);

        console.log(`Chat privado iniciado etre ${recipiente} en la sala ${roomName}`)
        
        usernameHeader.textContent = usernameContact
        chatMessages.innerHTML = "";
        const saludo = document.createElement("li");
        saludo.innerHTML = `El usuario ${recipiente}, se conectó`
        chatMessages.appendChild(saludo);
        chatMessages.dataset.userId = roomName;

        socket.roomName = roomName

        // formChat.replaceWith(formChat.cloneNode(true)); // Clona el formulario para eliminar eventos anteriores
        formChat.addEventListener("submit", (event) => {
            event.preventDefault();
            if (chatinput.value.trim()) {
                socket.emit("privateMessage", { roomName: socket.roomName, message: chatinput.value });
                chatinput.value = "";
            }
        });
        socket.emit("recoverMessages", roomName);
    })

    // socket.off("sendMessage"); // Elimina cualquier controlador previo
    socket.on("sendMessage", (data) => {
        if(chatMessages.dataset.userId == data.roomName){
            const item = document.createElement("div");
            item.innerHTML = `<div class="message received">
                                <span class="sender">De ${data.sender}:</span>
                                <p>${data.message}</p>
                            </div>`;
            chatMessages.appendChild(item);
            item.scrollIntoView({ behavior: "smooth", block: "start" });
        }
            
        
    });

    socket.on("recoveredMessages", (messages) => {
        chatMessages.innerHTML = "";
        messages.forEach(message => {
            const item = document.createElement("div");
            item.innerHTML = `<div class="message received">
                                <span class="sender">De ${message.sender}:</span>
                                <p>${message.content}</p>
                            </div>`;
            chatMessages.appendChild(item);
            
        });

        // aprendo esto nuevo: enviar el scroll hasta el ultimo item aparecido desde base de datos.
        const lastitem = chatMessages.lastElementChild;
        lastitem.scrollIntoView({ behavior: "instant", block: "start" });
        
    });


    // socket.on("chat message", (msg, serverOffset)=>{
    //     console.log("Server offset: ", serverOffset)
    //     const item = document.createElement("div");
    //     item.innerHTML = `<div class="message received">
    //                           <span class="sender">De hola:</span>
    //                           <p>${msg}</p>
    //                       </div>`;
    //     messages.appendChild(item);
    //     window.scrollTo(0, document.body.scrollHeight)
    //     socket.auth.serverOffset = serverOffset;
    //   })

    // socket.on("sendMessage", (data)=>{
    //     console.log("Mensahe privado recibido: ", data.message)
    //     console.log("MENSAJE RECIBIOD DE SERVIDOR: ", data.message)

        
    //     let item = document.createElement("div")
    //     item.innerHTML = `<div class="message received">
    //                                         <span class="sender">De ${data.sender}:</span>
    //                                         <p>${data.message}</p>
    //                                     </div>`;
    //     chatMessages.appendChild(item);
    // })

}
initChat ()

