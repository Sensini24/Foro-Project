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


function IncreaseNumberNotifications(notifUnreadList, notifNumber, notifications){
    // Filtrar solo los no leidos. Esto es para el modal en header
    notifUnreadList.innerHTML = "";
    const noleidos = notifications.filter(dato => dato.isRead == false);
    notifNumber.innerHTML = noleidos.length;

    noleidos.forEach(elem=>{
        const {message, type, createdAt} = elem;
       

        const messageNotif = getDateMessage(createdAt)
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

        switch(type){
            case "firstmessage":
                notifUnreadList.innerHTML += item;
            case "youlike":
                notifUnreadList.innerHTML += item;

        }
    })
}

function realtimeNotifications(socket,domElements){
    socket.on("newNotification", (notifications)=>{
        const {notifNumber, notifUnreadList} = domElements;
        console.log("Notificaciones recibidas en tiempo real: ", notifications);
        // Incrementar numero de notificaciones no leidas.
        IncreaseNumberNotifications(notifUnreadList, notifNumber, notifications)

        
    })
}
function getNotifications(socket,domElements){
    socket.on("show notifications", (notifications)=>{
        const {notifNumber, notifUnreadList} = domElements;
        
        console.log("Notificaciones recuperadas: ", notifications);
        IncreaseNumberNotifications(notifUnreadList, notifNumber, notifications)
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

function getDateMessage(createdAt){
    const FechaNotification = new Date(createdAt);
    const FechaCurrent = new Date()

    const yearNotif = FechaNotification.getFullYear()
    const yearCurrent = FechaCurrent.getFullYear()
    const montNotif = FechaNotification.getMonth()
    const monthCurrent = FechaCurrent.getMonth()
    const dayNotif = FechaNotification.getDate()
    const dayCurrent = FechaCurrent.getDate()
    const hourNotif = FechaNotification.getHours()
    const hourCurrent = FechaCurrent.getHours()
    const minuteNotif = FechaNotification.getMinutes()
    const minuteCurrent = FechaCurrent.getMinutes()
    // console.log("Año Notif: ", yearNotif, "/ Año Actual: ", yearCurrent)
    // console.log("Mes Notif: ", montNotif, "/ Mes Actual: ", monthCurrent)
    // console.log("DIa Notif: ", dayNotif, "/ DIa Actual: ", dayCurrent)
    // console.log("Hora Notif: ", hourNotif, "/ Hora Actual: ", hourCurrent)
    // console.log("Minuto Notif: ", minuteNotif, "/ Minuto Actual: ", minuteCurrent)
    let messageTime = "";
    
    if(yearCurrent > yearNotif){
        return messageTime = `Hace ${yearCurrent -yearNotif} años`
    }else if(yearCurrent < yearNotif){
        return messageTime = `Hace ${yearNotif - yearCurrent} años`
    }else if(monthCurrent > montNotif){
        return messageTime = `Hace ${monthCurrent -montNotif} meses`
    }else if(monthCurrent < montNotif){
        return messageTime = `Hace ${montNotif - monthCurrent} meses`
    }else if(dayCurrent > dayNotif){
        return messageTime = `Hace ${dayCurrent -dayNotif} días`
    }else if(dayCurrent < dayNotif){
        return messageTime = `Hace ${dayNotif - dayCurrent} días`
    }else  if(hourCurrent > hourNotif){
        return messageTime = `Hace ${hourCurrent -hourNotif} horas`
    }else if(hourNotif < hourCurrent){
        return messageTime = `Hace ${hourNotif - hourCurrent} horas`
    }else if(minuteCurrent > minuteNotif){
        return messageTime = `Hace ${minuteCurrent-minuteNotif} minutos`
    }else if(minuteCurrent < minuteNotif){
        return messageTime = `Hace ${minuteNotif-minuteCurrent} minutos`
    }
}

