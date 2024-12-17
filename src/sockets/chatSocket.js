import { Message } from "../Models/MessageModel.js";
import { NewContactNotification } from "./notificationsSocket.js";

const modelMessage = Message;
export function StartPrivateChat(socket, usuariosConectados){
    socket.on("startprivatechat", (recipienteId)=>{
        //? EL recipiente no es mas que el id de usuario pasado previamente y luego adjudicado a un item de cliente uqe al clicar nos devuelve dicho id, el cual servira como key para obtener el socket almacenado en un map mas arribita.
        const recipientSocketId = usuariosConectados.get(recipienteId)?.socketid;
    
        if(recipientSocketId){
            //EN caso de que exista, ordenamo y unimos el id del usuario actual mas el del usuario con quie queremos hablar.
            console.log(`Iniciando chat privado entre ${socket.user._id} y ${recipienteId}`);
        
            // Crear un nombre único para la sala
            const roomName = [socket.user._id, recipienteId].sort().join("-");
            console.log("Sala de chat creada: ", roomName)
            //Nos unimos al room
            socket.join(roomName);
    
            
            //ASOCIAR INFORMACION DE ROOM A SOCKET
            // socketRooms.set(socket.id, roomName); 
            const nombreContacto = usuariosConectados.get(recipienteId)?.nombre;
            socket.emit('privateChatStarted', socket.user._id, roomName, nombreContacto);
        }
    })
}

export async function SendPrivateMessage(socket, io, usuariosConectados){
    socket.on("privateMessage", async ({ roomName, message }) => {
        const lastDocument = await modelMessage.findOne({roomId: roomName}).sort({id_offset:-1});
        console.log("ultimo document: ", lastDocument);
        let ultimoId = lastDocument && lastDocument.id_offset ? lastDocument.id_offset + 1 : 1;
        console.log("ULTIMO ID: ", ultimoId);
        
        /*
         Recupero los ids de los mensaje y los recorro para ver si no hay mas que uno
         Si hay solo uno entonces es nuevo el contacto y se envia la notificacion al receptor para avisar que es un mensaje de alguien que no está en su contacto.
        */
        NewContactNotification(io,socket, roomName, usuariosConectados)
        
        if (!ultimoId || isNaN(ultimoId)) {
            console.error('Error: No se pudo calcular un id_offset válido');
            return;
          }
    
        const result = await new modelMessage({
            id_offset:ultimoId,
            content: message,
            date: new Date(),
            senderId: socket.user._id,
            roomId:roomName
        }).save();
    
        console.log("Mensaje guardado correctamente", result.id_offset);
    
        io.to(roomName).emit("sendMessage", {sender: socket.user.user_name, message, ultimoId, roomName });
    
    });
}




//?======================CHAT CON NUEVOS USUARIOS EN BUSCADOR =========================
export function StarChatNewContact(socket){
    socket.on("startchat newcontact", (idContact, usernamecontact)=>{
        console.log("RECIBIENDO DATOS DE CONTACTO DE CLIENTE: ", idContact, usernamecontact)

        if(idContact){
            console.log("Creando chat entre ", idContact, " y ", socket.user._id)

            const roomName = [socket.user._id, idContact].sort().join("-");

            socket.join(roomName);
            console.log("Sala de chat creada con usuario desconocido: ", roomName)
            
            socket.emit('privateChatStarted', socket.user._id, roomName, usernamecontact);
        }
    })
}