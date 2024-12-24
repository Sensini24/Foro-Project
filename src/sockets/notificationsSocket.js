import { Contact } from "../Models/ContactModel.js";
import { Message } from "../Models/MessageModel.js";
import { Notification } from "../Models/NotificationModel.js";
import { User } from "../Models/User.js";

const modelNotification = Notification;
const modelMessage = Message;
const modelContact = Contact;
const modelUsuario = User;

// Recupera notificaciones y se los envia a cliente
export async function recoverNotification(socket,userID){
    socket.on("recover notifications", async()=>{
        let notifSearch = await notificationsDataBase(userID);
        socket.emit("show notifications", notifSearch)

    })
}

async function notificationsDataBase(idReceptor){
    try{
        const notifications = await modelNotification.find({
            recipientId:idReceptor,
            status:"pending"
        }).sort({createdAt:-1})
        // console.log("Notifications enviadas: ", notifications)
        return notifications;
    }catch(error){
        console.log("Error al recuperar las notificaciones: ", error)
    }
}

// Crea notificación de recepcion de mensajes de desconocidos
export async function NewContactNotification(io, socket, roomName, usuariosConectados, message, nameContact, idContact){
    console.log("USUARIOS CONECTADOS EN NOTIFICATION: ", usuariosConectados)
    const messages = await modelMessage.find({ roomId: roomName }).sort({ id_offset: -1 });
    const messageChat = message;
    let ids = []
    messages.forEach(elemento =>{
        if(ids.includes(elemento.senderId.toString())){
            console.log("ya esta")
        }else{
            ids.push(elemento.senderId.toString())
        }
    })

    //! Aqui tambien se podria validadr que si es que tampoco está en tus contactos entonces ahi si se ejecuta toda esta lógica
    if(ids.length == 1){
        const idsrooms = roomName.split("-")
        console.log("SOCKET USER N NOTIFICATION: ", socket.user)
        const receptorId = idsrooms.find(id=> id !== socket.user._id)

        // En caso de que no esté conectado lo guarda en database, si lo esta lo guarda y lo envia en tiempo real.
        let receptorSocket = usuariosConectados.get(receptorId) != null || undefined ? usuariosConectados.get(receptorId).socketid : null
        console.log("Receptor socket: ", receptorSocket);

        const senderId = socket.user._id
        const message = `El usuario ${socket.user.user_name} no está en tus contactos y te envió un mensaje al chat: "${messageChat}". Aceptas agregarlo o ignorarlo?`

        const notifSended = await new modelNotification({
            senderId: senderId,
            recipientId: receptorId,
            message: message,
            type: "firstmessage",
            roomId: roomName,
            isRead: false,
            status: "pending",
            createdAt: new Date()
        });

        try {
            await notifSended.save();
            console.log("Notificación guardada en la base de datos.");

            
            let notifSearch = await notificationsDataBase(receptorId);

            //guardado de contacto en pending
            await saveContact(senderId, receptorId, "pending", io, socket, nameContact, idContact)

            


            if(receptorSocket || receptorSocket == null){
                io.to(receptorSocket).emit("newNotification", notifSearch);
            }

        } catch (error) {
            console.error("Error al guardar la notificación:", error);
        }
    }
}

async function saveContact(owner_id, contact_id, estado, io, socket, nameContact){
    try{
        const newContact = await new modelContact(
            {
                "owner_id": owner_id,
                "contact_id": contact_id,
                "estado": estado,
                "isFavorite": false,
                "date": new Date()
            }
        )

        const repeatContact = await modelContact.find({"owner_id": owner_id, "contact_id": contact_id})

        if(repeatContact.length >0){
            return console.log("Este usuario ya estás en tus contactos.")
        }
        await newContact.save();

        //! Envio del contacto en pending hacia el emisor
        io.to(socket.id).emit("getPendingContact", nameContact, contact_id)

        console.log("Contacto guardado en la base de datos: ", newContact);

    }catch(error){
        console.log("El contacto no pudo ser guardado: ", error)
    }

}


export async function newInteractionNotification(socket, usuariosConectados, io){
    socket.on("newLike notification", async (usuarioUserPost, postName)=>{
        const receptorUser = await modelUsuario.find({user_name:usuarioUserPost});
        const idReceptor = receptorUser[0]._id.toString();
        const senderId = socket.user._id
        console.log("recepcion de postname: ", postName)
        
        const message = `El usuario ${socket.user.user_name} le dio like a tu post titulado:  "${postName}"`
        console.log("Id de usuario: ", receptorUser[0]._id);

        let receptorSocket = usuariosConectados.get(idReceptor) != null || undefined ? usuariosConectados.get(idReceptor).socketid : null
        console.log("socket de receptor: ", receptorSocket)
        const notifSended = await new modelNotification({
            senderId: senderId,
            recipientId: idReceptor,
            message: message,
            type: "youlike",
            isRead: false,
            status: "pending",
            createdAt: new Date()
        });
        try{
            await notifSended.save();
            console.log("Notificación guardada exitosamente")
            const notifSearch = await notificationsDataBase(idReceptor);
            console.log("Notificacion enviada: ", notifSearch)

            const tamaño= notifSearch.length
            if(receptorSocket || receptorSocket == null){
                io.to(receptorSocket).emit("newNotification", notifSearch);
                console.log("Enviado a socket: ", receptorSocket)
                console.log("Enviado en tiempo real: ", notifSearch[tamaño-1].createdAt)
            }
        }catch(err){
            console.log("No se pudo guardar esta notificación: ", err);
        }
       });
}