import { getDateMessage } from "./headerclient.js"

export async function initInteractNotifications(){
    console.log("Ingresando a modulo de notificaciones")
    const domElements = cacheDOMElements();
    await convertDate(domElements);
    getTitleNotif(domElements);
    assignActionsNotif(domElements);
    interactionButtonsNotif(domElements)
}

function cacheDOMElements(){
    return{
        time : document.querySelectorAll(".notification-time"),
        notifTitle: document.querySelectorAll(".notification-title"),
        notifContent: document.querySelectorAll(".notification-content"),
        notifList: document.querySelector(".notifications-list"),
        notifItem: document.querySelectorAll(".notification-item")
    }
}

export const convertDate =async (domElements)=>{
    const {time} = domElements;
    time.forEach(async time=>{
        // console.log("time: ", time)
        let date = time.textContent
        let dateconvert = new Date(date)

        const result = await getDateMessage(dateconvert);
        time.textContent = result
    })
}

const getTitleNotif = async (domElements)=>{
    const {notifTitle} = domElements;
    await notifTitle.forEach(title=>{
        // console.log("title: ", title)
        let typeTitle = title.textContent
         switch(typeTitle){
            case "firstmessage":
                title.textContent = "Nuevo Contacto"

                break;
            case "youlike":
                title.textContent = "Nuevo Like"
                break;

            case "newcontact":
                title.textContent = "Contacto Aceptado"
                break;
        }
    })
}
const assignActionsNotif = (domElements)=>{
    const {notifContent} = domElements;
    notifContent.forEach(content=>{
        console.log("content: ", content)
        let typeTitle = content.querySelector(".notification-title").textContent;
        console.log("notificationtitle: ", typeTitle)
        let item = ""
        switch(typeTitle){
            case "Nuevo Contacto":
            item = `<div class="notification-actions">
                        <button class="action-btn accept">Aceptar</button>
                        <button class="action-btn reject">Rechazar</button>
                    </div>`
            content.innerHTML  += item;
            break;

            case "Nuevo Like":
            item = `<div class="notification-actions">
                        <button class="action-btn">Responder</button>
                        <button class="action-btn">Ver comentario</button>
                    </div>`
            content.innerHTML  += item;
            break;
        }
    })

    
}

const interactionButtonsNotif = (domElements)=>{
    const {notifList, notifItem} = domElements;
    notifItem.forEach(element=>{
        element.addEventListener("click", (event)=>{
            if (event.target.closest("button.accept")) {
                
                let target = event.target.closest("button.accept");
                console.log("BUTTON ACCEPT: ", target);

                //Obtencion de dataset id de receptor y sender 
                const senderId = element.dataset.senderId;
                const recipientId = element.dataset.recipientId;
                const title = element.querySelector(".notification-time")
                console.log("title: ", title)
                console.log("dATOS: ", senderId,recipientId);
                
            }
        })
    })
    notifList.addEventListener("click", (event)=>{
        
        
    })
}