import { convertDate, getTitleNotif } from "./notificationclient.js";

document.addEventListener("DOMContentLoaded", ()=>{
    console.log("Iniciando modulo de header")
})

export function initHeaderOptions(){
    
    const socket = initializeSocket();
    const domElements = ChargeDOMElements();
    
    showNotifications(socket, domElements);
    showModalNotifications(domElements);
    getNotifications(socket,domElements);
    realtimeNotifications(socket,domElements);
    // notifModalFunctionality(domElements);
    convertDate(domElements);
    getTitleNotif(domElements);
    menuButton(domElements)
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
        notifUnreadContainer: document.querySelector(".notification.unread"),
        notifUnreadList : document.querySelector(".notifications-list"),
        cardNotifContainer : document.querySelector(".card-content"),
        allNotifButton : document.querySelector(".all-button"),
        cardNotification : document.querySelector("#li-notification"),
        // notifContainerInterfaz: document.querySelector(".notifications-container"),
        time : document.querySelectorAll(".notification-time"),
        notifTitle: document.querySelectorAll(".notification-title"),
    }
    
}

function showNotifications(socket, domElements) {
    const { notifContainer } = domElements;

    socket.on("connect", () => {
        console.log("Conectado al servidor");
        socket.emit("recover notifications"); 
    });

}


async function IncreaseNumberNotifications(notifUnreadList, notifNumber, notifications) {
    notifUnreadList.innerHTML = "";
    const noleidos = await notifications.filter(dato => dato.isRead == false);
    notifNumber.innerHTML = noleidos.length;

    for (const elem of noleidos) {
        // console.log("room id de notif: ", elem)
        const {message, type, createdAt, senderId, recipientId, _id} = elem;
        let notifId = _id;
        let messageNotif = await getDateMessage(createdAt);
        let item = await gethtmlNotifications(type, message, messageNotif, senderId, recipientId, notifId)
        // console.log("Id de notificaciones no leidas: ", elem._id )
        notifUnreadList.innerHTML += item;
    }
}


async function realtimeNotifications(socket,domElements){
    socket.on("newNotification", async (notifications)=>{
        const {notifNumber, notifUnreadList} = domElements;
        console.log("Notificaciones recibidas en tiempo real: ",notifications);
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

export async function getDateMessage(createdAt) {
    try {
        const FechaNotification = new Date(createdAt);
        const FechaCurrent = new Date();
        
        if (isNaN(FechaNotification.getTime())) {
            // console.log("Fecha inválida, retornando valor por defecto");
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

function gethtmlNotifications(typehtml, message, messageNotif, senderId, recipientId, notifId){
    const notificationsStyles = {
        "firstmessage": `<div class="notification-item" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="avatar">O</div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <div class="notification-title">
                                <span class="status-indicator"></span>
                                Contacto Desconocido
                            </div>
                            <span class="notification-time">${messageNotif}</span>
                        </div>
                        <div class="notification-text">
                        ${message}
                        </div>
                    </div>
                    <div class="menu-button">⋮</div>
                    <div id="menu-notification" class="menu-container">
                        <p>hola</p>
                    </div>
                </div>`,

             "youlike": `<div class="notification-item" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="avatar">O</div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <div class="notification-title">
                                <span class="status-indicator"></span>
                                Nuevo Like
                            </div>
                            <span class="notification-time">${messageNotif}</span>
                        </div>
                        <div class="notification-text">
                        ${message}
                        </div>
                    </div>
                    <div class="menu-button">⋮</div>
                    <div id="menu-notification" class="menu-container">
                        <p>hola</p>
                    </div>
                </div>`,

        "newcontact" : `<div class="notification-item" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="avatar">O</div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <div class="notification-title">
                                <span class="status-indicator">Contacto Desconocido</span>
                                Contacto Desconocido
                            </div>
                            <span class="notification-time">${messageNotif}</span>
                        </div>
                        <div class="notification-text">
                        ${message}
                        </div>
                    </div>
                    <div class="menu-button">⋮</div>
                    <div id="menu-notification" class="menu-container">
                        <p>hola</p>
                    </div>
                </div>`,
    }

    return notificationsStyles[typehtml];

}

// function notifModalFunctionality(domElements){
//     const {cardNotifContainer} = domElements
    
//     cardNotifContainer.addEventListener("click", async (event)=>{
//         const icon = event.target.closest(".notif-read-icon");
//         const notification = event.target.closest("li");
//         const idNotification = notification.dataset.notifId;
//         console.log("ID DE NOTIFICACION : ", idNotification, notification)
//         if(icon){
//             event.preventDefault()
//             await handlerIconRead(idNotification)
//             notification.remove()
//             return
//         }

//         if(notification){
//             handlerNotificationCard(notification)
//         }
        
        
//     })
// }


async function handlerIconRead(idNotif){
    console.log("Si hay lector: ", idNotif)

    const response = await fetch("/notif/isread",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({idNotif:idNotif})
    })
    const data = await response.json();
    if(data.success){
        console.log("Marcado como leído: ", data.message)
    }else if(!data.success){
        console.log("NO se pudo marcar como leído: ", data.message)
    }
}

function handlerNotificationCard(notification){
    const senderId = notification.dataset.senderId;
    const recipientId = notification.dataset.recipientId;
    console.log("Sender ID:", senderId);
    console.log("Recipient ID:", recipientId);
}

const menuButton = (domElements)=>{
    const {notifUnreadList} = domElements;
    notifUnreadList.addEventListener("click", (event)=>{
        const menu = event.target.closest(".menu-button")
        console.log("menu", menu)
        if(menu){
            const menuContainer = menu.closest(".notification-item") 
            const dato = menuContainer.querySelector("#menu-notification")
            let datos = dato.style.display =="block"
                datos ? dato.style.display ="none" :
                dato.style.display ="block"
            console.log("menu container: ", menuContainer)
            console.log("div: ", dato)

        }
    })
}

// const handlerFilterButtons =async(type)=>{
//     try {
//         const response = await fetch(`/notif/${type}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok) {
//             throw new Error("Hubo un problema al obtener las notificaciones");
//         }

//         const data = await response.text();
//         console.log("Notificaciones filtradas: ", data);

//         const htmlData = await response.text();
//         console.log("Notificaciones filtradas:", htmlData);

//         // Actualizamos la interfaz con las notificaciones obtenidas
//         notifDisplayContainer.innerHTML = htmlData;
//         // Aquí podrías manejar la actualización de la interfaz con las notificaciones filtradas
//     } catch (err) {
//         console.error("Error en la solicitud: ", err.message);
//     }
// }
