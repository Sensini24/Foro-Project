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
    notifModalFunctionality(domElements);
    NotifInterfazFuncionality(domElements);
    convertDate(domElements),
    getTitleNotif(domElements)
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
        notifUnreadList : document.querySelector(".notification-list"),
        cardNotifContainer : document.querySelector(".card-content"),
        allNotifButton : document.querySelector(".all-button"),
        cardNotification : document.querySelector("#li-notification"),
        notifContainerInterfaz: document.querySelector(".notifications-container"),
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

function gethtmlNotifications(typehtml, message, messageNotif, senderId, recipientId, notifId){
    const notificationsStyles = {
        "firstmessage": `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="notification-icon">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 23h-24v-13.275l2-1.455v-7.27h20v7.272l2 1.453v13.275zm-20-10.472v-9.528h16v9.527l-8 5.473-8-5.472zm14-.528h-12v-1h12v1zm0-3v1h-12v-1h12zm-7-1h-5v-3h5v3zm7 0h-6v-1h6v1zm0-2h-6v-1h6v1z"/></svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Contacto desconocido</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>
                
            </li>`,

        "youlike" : `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Nuevo Like</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>
            </li>`,

        "newcontact" : `<li class="notification unread" id="li-notification" data-sender-id=${senderId} data-recipient-id=${recipientId} data-notif-id=${notifId}>
                    <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.5 17.311l-1.76-3.397-1.032.505c-1.12.543-3.4-3.91-2.305-4.497l1.042-.513-1.747-3.409-1.053.52c-3.601 1.877 2.117 12.991 5.8 11.308l1.055-.517z"/></svg>
                </div>
                <div class="notification-content">
                    <h2 class="notification-title">Nuevo Like</h2>
                    <p class="notification-message">${message}</p>
                    <span class="notification-time">${messageNotif}</span>
                </div>
                <div class="notif-read-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path d="M3.875 12.969h-2.854s4.906-8.771 5.511-9.875c.425-.777 1.042-1.094 1.55-1.094.826 0 1.553.899 1.496 2.703-.014.439-.587.36-.578-.031.042-1.776-1.157-1.911-1.604-.838-.968 2.322-2.275 5.849-3.521 9.135zm20.125 1.031l-1 8h-7.607c-.788 0-1.446-.501-1.791-1.209-.402-.827-.874-1.773-1.602-1.773s-1.199.947-1.602 1.773c-.344.708-1.002 1.209-1.791 1.209h-7.607l-1-8h24zm-15 3c0-.552-.447-1-1-1h-4.547c-.734 0-1.13.53-1.059 1.156.072.627.126 1.219.231 1.844.119.707.479 1 1.126 1h4.249c.553 0 1-.448 1-1v-2zm12.605.156c.072-.626-.324-1.156-1.058-1.156h-4.547c-.553 0-1 .448-1 1v2c0 .552.447 1 1 1h4.249c.646 0 1.007-.293 1.126-1 .105-.625.159-1.217.23-1.844zm-6.605-12.484c-.042-1.776 1.157-1.911 1.604-.838.968 2.322 2.274 5.849 3.521 9.135h2.854s-4.906-8.771-5.511-9.875c-.425-.777-1.042-1.094-1.55-1.094-.826 0-1.553.899-1.496 2.703.014.439.587.36.578-.031z"/></svg>
                </div>
            </li>`,
    }

    return notificationsStyles[typehtml];

}

function notifModalFunctionality(domElements){
    const {cardNotifContainer, allNotifButton, cardNotification} = domElements
    

    cardNotifContainer.addEventListener("click", async (event)=>{
        const icon = event.target.closest(".notif-read-icon");
        const notification = event.target.closest("li");
        const idNotification = notification.dataset.notifId;
        console.log("ID DE NOTIFICACION : ", idNotification, notification)
        if(icon){
            event.preventDefault()
            await handlerIconRead(idNotification)
            notification.remove()
            return
        }

        if(notification){
            handlerNotificationCard(notification)
        }
        
        
    })
}

function NotifInterfazFuncionality(domElements){
    const {notifContainerInterfaz} = domElements;
    notifContainerInterfaz.addEventListener("click", async(event)=>{
        const target = event.target
        const filterButtons = target.closest(".filter-btn")
        if(filterButtons){
            const type = filterButtons.textContent.trim()
            console.log(filterButtons.textContent.trim())
            window.location.href = `/notif/${type}`;
            
        }
    })

}
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

const handlerFilterButtons =async(type)=>{
    try {
        const response = await fetch(`/notif/${type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Hubo un problema al obtener las notificaciones");
        }

        const data = await response.text();
        console.log("Notificaciones filtradas: ", data);

        const htmlData = await response.text();
        console.log("Notificaciones filtradas:", htmlData);

        // Actualizamos la interfaz con las notificaciones obtenidas
        notifDisplayContainer.innerHTML = htmlData;
        // Aquí podrías manejar la actualización de la interfaz con las notificaciones filtradas
    } catch (err) {
        console.error("Error en la solicitud: ", err.message);
    }
}
