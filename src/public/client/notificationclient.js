import { getDateMessage } from "./headerclient.js"

document.addEventListener("DOMContentLoaded", async () => {
    const domElements = { 
        time: document.querySelectorAll(".notificationInterfaz-time") 
    };

    
    const {time} = domElements
    //! TUVE QUE AGREGAR ESTA FUNCION AQUI POR QUE NECESARIAMENTE ME PIDE QUE SE CARGUE ELL DOM PRIMERO
    await convertDate(time);
});

export async function initInteractNotifications(){
    console.log("Ingresando a modulo de notificaciones")
    const domElements = cacheDOMElements();
    getTitleNotif(domElements);
    assignActionsNotif(domElements);
    interactionButtonsNotif(domElements);
    NotifInterfazFuncionality(domElements)
    // await convertDate(domElements);
    contactActiveStateColor()
    ShowCommentNotification(domElements)
    allreadbtn(domElements)
}
function cacheDOMElements(){
    return{
        time : document.querySelectorAll(".notificationInterfaz-time"),
        notifTitle: document.querySelectorAll(".notification-title"),
        notifContent: document.querySelectorAll(".notification-content"),
        notifList: document.querySelector(".notifications-list"),
        notifItem: document.querySelectorAll(".notification-item"),
        notifContainerInterfaz: document.querySelector(".notifications-container"),
        MenuButton: document.querySelectorAll(".menu-button"),
        menuNotification: document.querySelectorAll(".menu-notification"),
        notifListInterfaz: document.querySelector(".notification-list"),
        btnAllRead: document.querySelector("#btn-allread")
    }
}


//? CONVIERTE LOS DATOS DE TIEMPO EN DATOS MAS EXACTOS
export const convertDate =async (time)=>{
    Array.from(time).forEach(async time=>{
        
        let date = time.textContent
        let dateconvert = new Date(date)

        const result = await getDateMessage(dateconvert);
        
        
        // console.log("resultado converison tiemop notifiaciones: ", time)
        if(result){
            time.textContent = result
        }else{
            time.textContent = "no hay"
        }
        
    })
}
// export const convertDate =async (domElements)=>{
//     const {time} = domElements;
//     time.forEach(async time=>{
//         let date = time.textContent
//         let dateconvert = new Date(date)

//         const result = await getDateMessage(dateconvert);
        
//         // console.log("resultado converison tiemop notifiaciones: ", time)
//         if(result){
//             time.textContent = result
//         }else{
//             time.textContent = "no hay"
//         }
        
//     })
// }

//? TRADUCE LOS TIPOS DE NOTIFICACIONES A TITULOS LEGIBLES Y ENTENDIBLES
export const getTitleNotif = async (domElements)=>{
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

            case "youcomment":
                title.textContent = "Nuevo Comentario"
        }
    })
}

//? ASIGNA BOTNOS O ELEMENTOS POR TIPO DE NOTIFICACION A LA LISTA DE NOTIFICACIONES COMPLETAS.
const assignActionsNotif = (domElements)=>{
    const {notifContent} = domElements;
    notifContent.forEach(content=>{
        console.log("content: ", content)
        let typeTitle = content.querySelector(".notification-title").textContent.trim();
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
{/* <button class="action-btn">Responder</button> */}
            case "Nuevo Comentario":
            item = `<div class="notification-actions">
                        
                        <button class="action-btn tocomment">Ver comentario</button>
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

//? USO LOCALSTROGAE PARA MANTENER EL ENCABEZADO ELEGIDO PINTADO Y QUITAR AL OTRO
function NotifInterfazFuncionality(domElements){
    const {notifContainerInterfaz} = domElements;
    notifContainerInterfaz.addEventListener("click", async(event)=>{
        
        const target = event.target
        const filterButtons = target.closest(".filter-btn")
        if(filterButtons){
            const type = filterButtons.textContent.trim()
            // console.log(filterButtons.textContent.trim())
            window.location.href = `/notif/${type}`;
            localStorage.setItem("activeContact", type)
            // const filterbtn = document.querySelectorAll(".filter-btn")
            // filterbtn.forEach(btn=>{
            //     btn.classList.remove(".active")
            //     console.log("ye: ", btn)
            // })  
        }
    })

}

//? SE RETORNA EL VALOR DE LOCAR STORAGE
function contactActiveStateColor(){
    const activeContactType = localStorage.getItem("activeContact");
    if (activeContactType) {
        const allNotifButtons = document.querySelectorAll(".filter-btn")
        
        allNotifButtons.forEach(btn => {
            btn.classList.remove(".active")
            if(btn.textContent.trim() == activeContactType) {
                btn.classList.add("active");
            }
        });
    }
}


//? ENVIARTE HASTA EL POST Y COMENTARIO a partir de UNA notificacioN
function ShowCommentNotification(domElements){
    const {notifListInterfaz} = domElements;
    notifListInterfaz.addEventListener("click", (event)=>{
        const notifItem = event.target.closest(".notification-item")
        console.log("Data idComment: ", notifItem.dataset.commentId)
        console.log("Data idComment: ", notifItem.dataset.postId)
        let commentId = notifItem.dataset.commentId;
        let postId = notifItem.dataset.postId
        if(notifItem){
            console.log("Notifications item: ", notifItem)
            const toCommentbtn = event.target.closest(".action-btn.tocomment")
            if(toCommentbtn){
                
                console.log("vamos al mensaje")
                window.location.href = `/post/${postId}#${commentId}`;

                // window.location.href= `/post/${postId}#comment-${commentId}`;
                
            }
        }
    })
}

// //? CARGAR BOTON DE MARCAR TODO COMO LEIDO
const allreadbtn = (domElements)=>{
    const {btnAllRead} = domElements;
    const type = localStorage.getItem("activeContact")
    const showBtnReadAll = type === "Sin leer" ? btnAllRead.style.display = "flex" : btnAllRead.style.display = "none"
}