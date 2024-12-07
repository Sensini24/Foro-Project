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
            serverOffset: 0
          }
    });

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

    socket.on("users connected", (usuariosConectados)=>{
        console.log("Usuarios conectados: ", usuariosConectados); //usuariosConectados[0][1].nombre)
        chatContacts.innerHTML = ""
        usuariosConectados.forEach(element => {
            
            let nombre = element[1].nombre
            let userIdRecip = element[0]
            console.log("Nombre: ", nombre)
            console.log("User id: ", userIdRecip)
            const userItem = document.createElement("li");
            userItem.classList.add("contacto")
            userItem.textContent = nombre;
            userItem.dataset.userId = userIdRecip;
            chatContacts.appendChild(userItem)

            userItem.addEventListener("click", () => {
                chatMessages.innerHTML = ""
                //* Aquí envío el userid previamente insertado como dataset a cada item de conectado.
                console.log(`Iniciando chat con ${nombre} (${userItem.dataset.userId})`);
                socket.emit("startprivatechat", userItem.dataset.userId); 
              });
              
        });
        
    })
    

    

    socket.on("privateChatStarted", (recipiente, roomName, username)=>{
        const chatHeader = document.querySelector(".chat-header")
        const contactslist = document.querySelectorAll("li.contacto");
        const arraylist = Array.from(contactslist);
        
        arraylist.forEach(elemento=>{
            console.log("elementos: ",elemento.getAttribute('data-user-id'));
            const dataId = elemento.getAttribute('data-user-id')
            if(dataId === recipiente){
                elemento.innerHTML += "hola" 
            }
        })

        console.log(`Chat privado iniciado etre ${recipiente} en la sala ${roomName}`)
        
        chatHeader.textContent = username
        chatMessages.innerHTML = "";
        const saludo = document.createElement("li");
        saludo.innerHTML = `El usuario ${recipiente}, se conectó`
        chatMessages.appendChild(saludo)

        socket.roomName = roomName

        formChat.addEventListener("submit", (event)=>{
            event.preventDefault();
            if (chatinput.value.trim()) {
                socket.emit("privateMessage", { roomName: socket.roomName, message: chatinput.value });
                chatinput.value = "";
            }
        })
        // // Limpia el evento de submit previo
        // formChat.removeEventListener("submit", handleChatSubmit);
        // handleChatSubmit = (event) => {
        //     event.preventDefault();
            
        // };
        // formChat.addEventListener("submit", handleChatSubmit);
        
    })

    socket.on("sendMessage", (data) => {
        const item = document.createElement("div");
        item.innerHTML = `<div class="message received">
                              <span class="sender">De ${data.sender}:</span>
                              <p>${data.message}</p>
                          </div>`;
        chatMessages.appendChild(item);
    });

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

