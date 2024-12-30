import { Notification } from "../Models/NotificationModel.js"

const modelNotification = Notification;

export const getNotifications = async (req,res)=>{
    // const type = req.body.params

    try{
        const datapayload = req.usuariodatospayload || null
        const idUsuario = datapayload._id
        // console.log("ID USUARIO DESDE CONTROLLER NIOTIF: ", idUsuario)
        const notifications = await modelNotification.find({recipientId:idUsuario}).sort({createdAt:-1})
        if(!notifications){
            return res.status(404).json({message:`No se encontro ninguna notification sobre ${type} `})
        }

        // console.log("NOTIFICACIOES DESDE CONTROLADOR: ", notifications)
        res.render("notifications",{
            notifications: notifications,
            layout: true
        })
    }catch(err){
        return res.status(400).json({message: `No se pudo obtener las notificaciones`})
    }
}

export const getNotificationsType = async (req,res)=>{
    
    try{
        const {type} = req.params
        const datapayload = req.usuariodatospayload || null
        const idUsuario = datapayload._id
        
        let filterType = changeType(type);
        console.log("Notificaciones por tipo: ", filterType)
        let notifications = []
        if(typeof filterType !== "string"){
            console.log("No es string: ", typeof filterType)
            notifications = await modelNotification.find({recipientId:idUsuario, isRead:filterType}).sort({createdAt:-1})
        }else{
            console.log("Es string: ", filterType)
            notifications = await modelNotification.find({recipientId:idUsuario, type:filterType}).sort({createdAt:-1})
        }
        // console.log("ID USUARIO DESDE CONTROLLER NIOTIF: ", idUsuario)
        // const notifications = await modelNotification.find({recipientId:idUsuario, type:type}).sort({createdAt:-1})
        // console.log("Notificaciones por tipo: ", notifications, type)
        if(!notifications){
            return res.status(404).json({success: false, message:`No se encontro ninguna notification sobre ${type}`})
        }

        console.log("NOTIFICACIOES DESDE CONTROLADOR: ", notifications)
        res.render("notifications",{
            notifications: notifications,
            layout:true
        })
    }catch(err){
        return res.status(400).json({success: false, message: `No se pudo obtener las notificaciones`})
    }
}

export const NotificationRead = async(req, res)=>{
    try{
        const datapayload = req.usuariodatospayload || null
        const idUsuario = datapayload._id
        const {idNotif} = req.body
        console.log("ID NOTIFICACION EN SERVIDOR PARA READ : ", idNotif)
        if(idNotif){
            const updateNotif = await modelNotification.updateOne({
                _id:idNotif, recipientId:idUsuario}, {$set:{isRead:true}}
            )

            console.log("LA notificacion fue marcada como leída: ", updateNotif)
            return res.status(200).json({success: true, message:"Notificación modificada correctamente"})
        }

        return res.status(404).json({success: false,message:"No se encontró la notificación"})


    }catch(err){
        return res.status(400).json({success: false,message:"NO se pudo moficar la notificación: ", err})
    }
    

}


const changeType=(type)=>{
    switch(type){
        case "Leídas":
            return true
        case "Sin leer":
            return false
        // case "Menciones":
        //     return "youlike"
        case "Likes":
            return "youlike"
        case "Contactos":
            return "newcontact"

        break;
    }
}
