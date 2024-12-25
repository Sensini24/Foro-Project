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

//? Obtener contactos pendientes de usuario
export async function recoverContacts(socket, userID){
    const userContacts = await modelContact.find({owner_id: userID, estado: "pending"}).
    populate("contact_id", "user_name email profilePic");
    if(userContacts){
        socket.emit("recover contacts", userContacts) 
    }
}

//Guardado de notifications
async function saveNotification(senderId, idReceptor, message, type){
    try{
        const newNotification = await new modelNotification({
            senderId: senderId,
            recipientId: idReceptor,
            message: message,
            type: type,
            isRead: false,
            createdAt: new Date()
        })
        
        const savedNotification = await newNotification.save();
        console.log("Notificación guardada exitosamente", savedNotification);
        return savedNotification;
    }catch(err){
        console.log("No se pudo guardar la notificación")
    }
}

// Guardado de Contacto
async function saveContact(owner_id, contact_id, estado){
    try{
        const newContact = await new modelContact({
            "owner_id":owner_id,
            "contact_id": contact_id,
            "estado": estado,
            "isFavorite": false,
            "date": new Date()
        })
        
        const savedContact = await newContact.save();
        console.log("Contacto guardado exitosamente", savedContact);
        return savedContact;
    }catch(err){
        console.log("No se pudo guardar el contacto")
    }
}

async function notificationsDataBase(idReceptor){
    try{
        const notifications = await modelNotification.find({
            recipientId:idReceptor
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

        const notif = await saveNotification(senderId, receptorId, message, "firstmessage")//guardado de notificacion
        console.log("Notificación guardada en la base de datos.");

        
        let notifSearch = await notificationsDataBase(receptorId);// Buscar en notif de receptor
        await saveNewContact(senderId, receptorId, "pending", io, socket, nameContact, idContact)//guardado de contacto en pending

        if(receptorSocket || receptorSocket == null){
            io.to(receptorSocket).emit("newNotification", notifSearch);
        }
    }
}

async function saveNewContact(owner_id, contact_id, estado, io, socket, nameContact){
    try{
        const repeatContact = await modelContact.find({"owner_id": owner_id, "contact_id": contact_id})

        if(repeatContact.length >0){
            return console.log("Este usuario ya estás en tus contactos.")
        }

        //! Guardamos el contacto pendiente para emisor y receptor en viceversa.
        const newcontactEmisor = await saveContact(owner_id, contact_id, estado)
        const newcontactReceptor = await saveContact(contact_id, owner_id, estado)

        const userContacts = await modelContact.find({owner_id: owner_id, estado: "pending"}).
        populate("contact_id", "user_name email profilePic");

        console.log("CONTACTO OBTENIDO EN TIEMPO REAL: ", userContacts)

        //! Envio del contacto en pending hacia el emisor
        // io.to(socket.id).emit("getPendingContact", nameContact, contact_id)
        io.to(socket.id).emit("getPendingContact", userContacts)

        // socket.emit

        console.log("Contacto para emisor guardado en la base de datos: ", newcontactEmisor);
        console.log("Contacto guardado en la base de datos: ", newcontactReceptor);

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

        let receptorSocket = usuariosConectados.get(idReceptor) != null || undefined ? usuariosConectados.get(idReceptor).socketid : null
        
        const notif = await saveNotification(senderId, idReceptor, message, "youlike")// Guardar notificación
        if(receptorSocket || receptorSocket == null){
            const notifSearch = await notificationsDataBase(idReceptor);
            console.log("Notificacion enviada: ", notifSearch)
            io.to(receptorSocket).emit("newNotification", notifSearch);
        }
       });
}





