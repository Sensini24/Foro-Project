document.addEventListener("DOMContentLoaded", ()=>{
    console.log("Iniciando modulo de header")
})

export function initHeaderOptions(){
    
    const socket = initializeSocket();
    const domElements = ChargeDOMElements();

    showNotifications(socket, domElements);
    showModalNotifications(domElements);
    getNotifications(socket,domElements);
    realtimeNotifications(socket,domElements)
}

function initializeSocket() {
    return io({
        auth: {
            serverOffset: 0
        }
    });
}

function ChargeDOMElements(){
    return{
        notifContainer: document.querySelector("#notifications-container"),
        card: document.querySelector(".card"),
        campanita: document.querySelector("#campanita"),
        notifNumber: document.querySelector("#notifications-number"),
        notifUnreadContainer: document.querySelector(".notification unread"),
        notifUnreadList : document.querySelector(".notification-list") 
    }
    
}

function showNotifications(socket, domElements) {
    const { notifContainer } = domElements;

    socket.on("connect", () => {
        console.log("Conectado al servidor");
        socket.emit("recover notifications"); // Emitir evento al conectar

        // socket.on("notifications stored", () => {
        //     console.log("Notificaciones almacenadas, recuperando...");
        //     socket.emit("recover notifications"); // Emitir evento para recuperar notificaciones
        // });
    });

}

function realtimeNotifications(socket,domElements){
    socket.on("newNotification", (notifications)=>{
        const {notifNumber, notifUnreadList} = domElements;
        notifUnreadList.innerHTML = "";
        console.log("Notificaciones recibidas: ", notifications);

        // Filtrar solo los no leidos. Esto es para el modal en header
        const noleidos = notifications.filter(dato => dato.isRead == false);
        notifNumber.innerHTML = noleidos.length;

        notifications.forEach(elem=>{
            const {message, type} = elem;

            let item = `<li class="notification unread">
                        <div class="notification-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                    </div>
                    <div class="notification-content">
                        <h2 class="notification-title">New Symposium Invitation</h2>
                        <p class="notification-message">${message}</p>
                        <span class="notification-time">2 hours ago</span>
                    </div>
                    <button>Aceptar</button>

                </li>`

            switch(type){
                case "firstmessage":
                    notifUnreadList.innerHTML += item;
            }

            
        })
    })
}

function getNotifications(socket,domElements){
    socket.on("show notifications", (notifications)=>{
        const {notifNumber, notifUnreadList} = domElements;
        notifUnreadList.innerHTML = "";
        console.log("Notificaciones recibidas: ", typeof notifications);

        // Filtrar solo los no leidos. Esto es para el modal en header
        const noleidos = notifications.filter(dato => dato.isRead == false);



        notifNumber.innerHTML = noleidos.length;

        notifications.forEach(elem=>{
            const {message, type} = elem;

            let item = `<li class="notification unread">
                        <div class="notification-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                    </div>
                    <div class="notification-content">
                        <h2 class="notification-title">New Symposium Invitation</h2>
                        <p class="notification-message">${message}</p>
                        <span class="notification-time">2 hours ago</span>
                    </div>
                    <button>Aceptar</button>

                </li>`

            switch(type){
                case "firstmessage":
                    notifUnreadList.innerHTML += item;
            }

            
        })
    })
}


function showModalNotifications(domElements){
    const { campanita, notifContainer} = domElements;
    campanita.addEventListener("click", () => {
        console.log("Notificaciones clicadas");
        let datos = notifContainer.style.display =="block"
        datos ? notifContainer.style.display ="none" :
            notifContainer.style.display ="block"
        let hideactive = campanita.classList == "isHide" ? campanita.classList = "isActive" : campanita.classList = "isHide"
        let hover = campanita.classList == "isHide" ? campanita.style.background = "none" : campanita.style.background = "#d7992a"
    });

    // notifContainer.addEventListener("click", (event) => {

    //     let elemento = event.target
    //     console.log("hola: " ,elemento)
    //     if(!elemento.closest(".card")){
    //         notifContainer.style.display ="none"
    //     }
    // })
    
}

