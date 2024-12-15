import express from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookie from "cookie";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv"
import { fileURLToPath } from 'url';
import {dirname, join} from 'path';
import postRoute from './Routes/postRoutes.js'
import commentRouter from './Routes/commentRoutes.js'
import authRoute from './Routes/authRoutes.js';
import chatRoute from './Routes/chatRoutes.js';
import connect from './database.js'
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import { verificarToken } from './Controllers/utils.js';
import routheTags from './Routes/tagsRoutes.js';
import routePostInteractions from './Routes/posinteractionRoutes.js';
import userRouter from './Routes/userRoutes.js';
import { layoutRoute } from './Routes/layoutRoutes.js';
import { Message } from './Models/MessageModel.js';
import { Socket } from 'dgram';
import { log } from 'console';
import { Notification } from './Models/NotificationModel.js';

const __dirname =dirname(fileURLToPath(import.meta.url));

dotenv.config()
const app = express()


//? Why asi? En este caso se hace uso de solicitudes http en tiempo real, se usa para Socket.IO
const server = createServer(app);
const modelMessage = Message;
const modelNotification = Notification;
//!CONECTAR SERVIDOR CON EL SOCKET IO
const io = new Server(server, {
    connectionStateRecovery: {},
});

//Parsear cookies
app.use(cookieParser());

// PAra uqe pueda leer json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//? Middleware para manejar autorizacion para servicios de socket.
io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie; // Leer cookies del encabezado
    if (!cookies) {
        return next(new Error('No autenticado: no se encontraron cookies'));
    }

    // Parsear las cookies
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.authToken; // Aquí el nombre debe coincidir con el de la cookie

    if (!token) {
        return next(new Error('No autenticado: falta el token en las cookies'));
    }
    console.log("token de verdad: ", token)
    try {
        // Verificar el token JWT
        const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        socket.user = user; // Asocia la información del usuario al socket
        console.log(socket.user)
        next();
    } catch (err) {
        next(new Error('Token inválido o expirado'));
    }
});


const usuariosConectados = new Map();
const contactos = new Map();
const socketRooms = new Map();

// 4. Manejar eventos de conexión después de configurar el middleware
io.on("connection", async (socket)=>{
    console.log("Usuario conectado ", socket.user, " con el id: ", socket.id)

    usuariosConectados.set(socket.user._id, {socketid:socket.id, nombre: socket.user.user_name  })

    const currentUser = {
        id: socket.user._id,
        nombre: socket.user.user_name
    };
    console.log("Usuarios conectados: ", usuariosConectados)

    async function recovereNotifications(idReceptor){
        try{
            const notifications = await modelNotification.find({
                recipientId:idReceptor,
                status:"pending"
            })
            console.log("Notifications enviadas: ", notifications)
            return notifications;
        }catch(error){
            console.log("Error al recuperar las notificaciones: ", error)
        }
    }

    //? Recuperacion de notifications
    const idReceptor = socket.user._id
    socket.on("recover notifications", async()=>{
        let notifSearch = await recovereNotifications(idReceptor);
        socket.emit("show notifications", notifSearch)
    })
    

    // LA PARTE DE LOS CHATS 
    // socket.on("chat message", async(msg)=>{
    //     //* Obtengo el último documento para saber su offset
    //     const lastDocument = await Message.findOne().sort({ id_offset: -1 });

    //     //* Si existe algún documento se le suma +1 a su offset, sino se le adjudica el valor de 1
    //     const ultimoId = lastDocument && lastDocument.id_offset ? lastDocument.id_offset + 1 : 1;

    //     if (!ultimoId || isNaN(ultimoId)) {
    //         console.error("Error: No se pudo calcular un id_offset válido");
    //         return;
    //     }
    //     console.log("Ultimo id: ", ultimoId);
    //     try{
    //         // Guardamos junto con el offset el cual será una guía del ultimo mensaje enviado o recibido al estar conectado
    //         result = await new modelMessage({
    //             "id_offset": ultimoId,
    //             "content": msg,
    //             "date": new Date()
    //         })

    //         console.log("Mensaje guardado: ", result.id_offset)
    //         await result.save();
    //     }catch(e){
    //         console.log("Error al recibir mensajes: ", e)
    //         console.log("Id offset: ", result.id_offset)
    //         return
    //     }

    //     // Se envía los mensajes junto con el ultimo id_offset para registrarlo en cliente.
    //     let nombre = socket.user.user_name;
        
    //     io.emit("chat message", msg, ultimoId, nombre)

        
    // });

   // Enviar usuario conectados 
    io.emit("users connected", Array.from(usuariosConectados), socket.user._id);

    //Atender peticion de chat privado
    socket.on("startprivatechat", (recipienteId)=>{
        //? EL recipiente no es mas que el id de usuario pasado previamente y luego adjudicado a un item de cliente uqe al clicar nos devuelve dicho id, el cual servira como key para obtener el socket almacenado en un map mas arribita.
        const recipientSocketId = usuariosConectados.get(recipienteId)?.socketid;

        if(recipientSocketId){
            //EN caso de que exista, ordenamo y unimos el id del usuario actual mas el del usuario con quie queremos hablar.
            console.log(`Iniciando chat privado entre ${socket.user._id} y ${recipienteId}`);
        
            // Crear un nombre único para la sala
            const roomName = [socket.user._id, recipienteId].sort().join("-");
            console.log("tipo de dato de roonName: ", typeof roomName)
            //Nos unimos al room
            socket.join(roomName);

            
            //ASOCIAR INFORMACION DE ROOM A SOCKET
            // socketRooms.set(socket.id, roomName); 
            const nombreContacto = usuariosConectados.get(recipienteId)?.nombre;
            socket.emit('privateChatStarted', socket.user._id, roomName, nombreContacto);
        }
    })

    //Evento que recibe que recibe información desde el contacto buscado en cliente
    socket.on("startchat newcontact", (idContact, usernamecontact)=>{
        console.log("RECIBIENDO DATOS DE CONTACTO DE CLIENTE: ", idContact, usernamecontact)

        if(idContact){
            console.log("Creando chat entre ", idContact, " y ", socket.user._id)

            const roomName = [socket.user._id, idContact].sort().join("-");
            console.log("tipo de dato de roonName: ", typeof roomName)

            socket.join(roomName);
            
            socket.emit('privateChatStarted', socket.user._id, roomName, usernamecontact);
        }
    })

    // socket.on("privateMessage", async (recipiente, msg)=>{
    //     console.log(`Mensaje privado de ${recipiente}: ${msg}`);
    //     const recipientSocketId = usuariosConectados.get(recipiente)?.socketid;
    //     io.to(recipientSocketId).emit("sendMessage", {
    //         sender: socket.user.user_name,
    //         message: msg,
    //     });
    // })
    
    socket.on("privateMessage", async ({ roomName, message }) => {
        const lastDocument = await modelMessage.findOne({roomId: roomName}).sort({id_offset:-1});
        console.log("ultimo document: ", lastDocument);
        let ultimoId = lastDocument && lastDocument.id_offset ? lastDocument.id_offset + 1 : 1;

        const messages = await Message.find({ roomId: roomName }).sort({ id_offset: 1 });

        
        let ids = []
        messages.forEach(elemento =>{
            if(ids.includes(elemento.senderId) ){
                console.log("ya esta")
            }else{
                ids.push(elemento.senderId)
            }   
        })

        //! Aqui tambien se podria validadr que si es que tampoco está en tus contactos entonces ahi si se ejecuta toda esta lógica
        if(ids.length == 1){
            const idsrooms = roomName.split("-")
            const receptorId = idsrooms.find(id=> id !== socket.user._id)
            const receptorSocket = usuariosConectados.get(receptorId).socketid
            const senderId = socket.user._id
            const message = `El usuario ${socket.user.user_name} no está en tus contactos y te envió un mensaje al chat. Aceptas agregarlo o ignorarlo?`
            const notifSended = await new modelNotification({
                senderId: senderId,
                recipientId: receptorId,
                message: message,
                type: "firstmessage",
                roomId: roomName,
                isRead: false,
                status: "pending",
                createdAt: new Date()
            })
            try {
                await notifSended.save();
                console.log("Notificación guardada en la base de datos.");

                let notifSearch = await recovereNotifications(receptorId);
                if(receptorSocket){
                    io.to(receptorSocket).emit("newNotification", notifSearch);
                }

            } catch (error) {
                console.error("Error al guardar la notificación:", error);
            }
        }
        
        console.log("ULTIMO ID: ", ultimoId);
        
        

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
    

    // console.log("sds: " , usuariosConectados)
    // Manejo de reconexión "manualmente", es decir con el uso de una guia "offset" y una base de datos.
    // if (!socket.recovered) {
    //     try {
    //         //! Obtenemos el ultimo offset registrado en cliente.
    //         const lastOffset = socket.handshake.auth.serverOffset || 0;
    //         const roomName = socketRooms.get(socket.id);

    //         console.log("recuperando cuarto: ", roomName);
    //         //Obtenenemo los mensaje cuentan con un offset mayor al del registrado por ultima vez en el cliente
    //         const messages = await Message.find({ roomId: roomName, id_offset: { $gt: lastOffset }}).sort({ id_offset: 1 });

    //         // recorremos los mensaje, creamos suscripcion y enviamos los datos junto con los parametros.
    //         if(messages){
    //             console.log("Mensajes recuperados", messages);
    //             messages.forEach(message => {
    //                 socket.emit('chat message', message.content, message.id_offset);
    //             });
    //         }else{
    //             console.log("NO SE ENCONTRARON DATOS");
    //         }
            
    //     } catch (e) {
    //         console.log("Error al recuperar mensajes perdidos: ", e);
    //     }
    // }

    socket.on("recoverMessages", async (roomName) => {
        try {
            const messages = await Message.find({ roomId: roomName }).sort({ id_offset: 1 });

            if (messages) {

                // let ids = []
                // messages.forEach(elemento =>{
                //     if(ids.includes(elemento.senderId) ){
                //         console.log("ya esta")
                //     }else{
                //         ids.push(elemento.senderId)
                //     }   
                // })

                // console.log("roomname: " , roomName)
                // const idsrooms = roomName.split("-")
                // console.log("idsroom: " , idsrooms)
                
                // console.log("ids de ususario en chat: ", ids)

                // let recipienteId = "";
                // idsrooms.forEach(id=>{
                //     if(id !== ids[0]){
                //         console.log(id)
                //         recipienteId=id
                //     }
                // })
                // if(ids.length == 1){
                    
                //     console.log("recipiente: ", recipienteId)
                //     console.log("senderid: ", ids[0])
                //     let firstmessage = true;

                //     const recipientSocket = usuariosConectados.get(recipienteId.trim())?.socketid;
                //     const receptorId = recipienteId;
                //     const senderSocket = usuariosConectados.get(ids[0].trim())?.socketid;
                //     console.log("socket id: ", recipientSocket)
                //     io.to(roomName).emit("firstmessage", firstmessage,receptorId, socket.user._id);
                //     // if (recipientSocket) {
                //     //     io.to(recipientSocket).emit("firstmessage", firstmessage, recipienteId, socket.user._id);
                //     //     io.to(senderSocket).emit("firstmessage", firstmessage, recipienteId, socket.user._id);
                //     // }
                    
                // }
                //! Aqui cambié porque emitia a todo el room, y cuando cambiaba de chat emergía tambien para el compañero de chat
                // io.to(roomName).emit('recoveredMessages', messages);
                socket.emit('recoveredMessages', messages);
                console.log("Mensajes recuperados: ", messages)
            } else {
                console.log("NO SE ENCONTRARON DATOS");
            }
        } catch (e) {
            console.log("Error al recuperar mensajes perdidos: ", e);
        }
    });

    socket.on("disconnect", ()=>{
        usuariosConectados.delete(socket.user._id)
        io.emit("users connected", Array.from(usuariosConectados));
        console.log(`Usuario ${socket.user._id} desconectado`);
    })
})
//configurar public
app.use(express.static(join(__dirname, 'public')));
// console.log(join(__dirname, 'public'));

//configurar Images
app.use(express.static(join(__dirname, 'Images')));
//console.log(join(__dirname, 'Images'));



//Configurar el motor de plantillas
app.set('views', join(__dirname, 'Views'))
// console.log("dir views:", join(__dirname, 'views'))
app.set('view engine', 'ejs');


app.use(authRoute)

//! Validacion de tokens y de paso envia payload en res.locals
app.use(verificarToken);
// Usar el middleware de layouts
app.use(expressLayouts);
// Establecer el layout por defecto
app.set('layout', 'layout'); // 'layout' es el nombre del archivo de layout (layout.ejs)


app.get('', (req, res)=>{
    res.send("Hola, perra")
})

app.use(postRoute);
app.use(commentRouter);
app.use(routheTags)
app.use(routePostInteractions)
app.use(layoutRoute)
app.use(chatRoute);
app.use(userRouter)


const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`El servidor está escuchando por http://localhost:${PORT}/`);
});

connect();