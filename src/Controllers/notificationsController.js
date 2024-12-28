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
            notifications: notifications
        })
    }catch(err){
        return res.status(400).json({message: `No se pudo obtener las notificaciones`})
    }
}

export const getNotificationsType = async (req,res)=>{
    
    try{
        const type = req.body.params
        const datapayload = req.usuariodatospayload || null
        const idUsuario = datapayload._id
        // console.log("ID USUARIO DESDE CONTROLLER NIOTIF: ", idUsuario)
        const notifications = await modelNotification.find({recipientId:idUsuario, type:type}).sort({createdAt:-1})
        if(!notifications){
            return res.status(404).json({message:`No se encontro ninguna notification sobre ${type} `})
        }

        // console.log("NOTIFICACIOES DESDE CONTROLADOR: ", notifications)
        res.render("notifications",{
            notifications: notifications
        })
    }catch(err){
        return res.status(400).json({message: `No se pudo obtener las notificaciones`})
    }
}

export const NotificationRead = async(req, res)=>{
    try{
        const datapayload = req.usuariodatospayload || null
        const idUsuario = datapayload._id
        const {idNotification} = req.body

        if(idNotification){
            const updateNotif = await modelNotification({
                _id:idNotification, recipientId:idUsuario}, {$set:{isRead:true}}
            )

            console.log("LA notificacion fue marcada como leída: ", updateNotif)
            return res.status(200).json({message:"Notificación modificada correctamente"})
        }

        return res.status(404).json({message:"No se encontró la notificación"})


    }catch(err){
        return res.status(400).json({message:"NO se pudo moficar la notificación: ", err})
    }
    

}


