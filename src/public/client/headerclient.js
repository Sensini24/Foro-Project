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


async function IncreaseNumberNotifications(notifUnreadList, notifNumber, notifications) {
    notifUnreadList.innerHTML = "";
    const noleidos = await notifications.filter(dato => dato.isRead == false);
    notifNumber.innerHTML = noleidos.length;

    for (const elem of noleidos) {
        const {message, type, createdAt} = elem;
        
        let messageNotif = await getDateMessage(createdAt);
        
        let item = `<li class="notification unread">
                    <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">New Symposium Invitation</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <button>Aceptar</button>

            </li>`

        switch(type) {
            case "firstmessage":
                notifUnreadList.innerHTML += item;
                break;
            case "youlike":
                notifUnreadList.innerHTML += item;
                break;
        }
    }
}


async function realtimeNotifications(socket,domElements){
    socket.on("newNotification", async (notifications)=>{
        const {notifNumber, notifUnreadList} = domElements;
        console.log("Notificaciones recibidas en tiempo real: ",typeof notifications[notifications.length-1].createdAt);
        // Incrementar numero de notificaciones no leidas.
        await IncreaseNumberNotifications(notifUnreadList, notifNumber, notifications)

        
    })
}
async function getNotifications(socket,domElements){
    socket.on("show notifications", async (notifications)=>{
        const {notifNumber, notifUnreadList} = domElements;
        
        console.log("Notificaciones recuperadas: ", notifications);
        await IncreaseNumberNotifications(notifUnreadList, notifNumber, notifications)
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
}

async function getDateMessage(createdAt) {
    try {
        const FechaNotification = new Date(createdAt);
        const FechaCurrent = new Date();
        
        if (isNaN(FechaNotification.getTime())) {
            console.log("Fecha inválida, retornando valor por defecto");
            return "Hace un momento";
        }

        const diff = FechaCurrent - FechaNotification;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (minutes < 1) return "Hace un momento";
        if (minutes === 1) return "Hace un minuto";
        if (minutes < 60) return `Hace ${minutes} minutos`;
        if (hours === 1) return "Hace una hora";
        if (hours < 24) return `Hace ${hours} horas`;
        if (days === 1) return "Hace un día";
        if (days < 30) return `Hace ${days} días`;
        if (months === 1) return "Hace un mes";
        if (months < 12) return `Hace ${months} meses`;
        if (years === 1) return "Hace un año";
        return `Hace ${years} años`;

    } catch (error) {
        console.error("Error procesando fecha:", error);
        return "Hace un momento";
    }
}
