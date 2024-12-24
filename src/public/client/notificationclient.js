import { getDateMessage } from "./headerclient.js"

export async function initInteractNotifications(){
    console.log("Ingresando a modulo de notificaciones")
    const time = document.querySelectorAll(".notification-time")
    time.forEach(async time=>{
        console.log("time: ", time)
        let date = time.textContent
        let dateconvert = new Date(date)

        const result = await getDateMessage(dateconvert);
        time.textContent = result
    })
}
