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
import notifRoute from './Routes/notificationsRoutes.js';
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
import { SendPrivateMessage, StarChatNewContact, StartPrivateChat } from './sockets/chatSocket.js';
import { acceptContact, commentNotification, newInteractionNotification, recoverContacts, recoverNotification, seeCountIds } from './sockets/notificationsSocket.js';
import { Contact } from './Models/ContactModel.js';

const __dirname =dirname(fileURLToPath(import.meta.url));

dotenv.config()
const app = express()


//? Why asi? En este caso se hace uso de solicitudes http en tiempo real, se usa para Socket.IO
const server = createServer(app);

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
        // console.log(socket.user)
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
    
    // console.log("Usuario conectado ", socket.user, " con el id: ", socket.id)
    usuariosConectados.set(socket.user._id, {socketid:socket.id, nombre: socket.user.user_name  })

    //? ENVIO DE DATOS PARA CONEXION DE CHAT O NOTIFICACIONES EN CASO SOLO DE QUE SE CONECTEN
    socket.emit("sendToken", usuariosConectados.get(socket.user._id))
    console.log("Usuarios conectados: ", usuariosConectados)

    //? Recuperacion de notifications mediante el id del usuario.
    const userID = socket.user._id
    recoverNotification(socket,userID);
    //? Recuperacion de notifications mediante el id del usuario.
    recoverContacts(socket, userID)

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

    //? Atender peticion de chat privado
    StartPrivateChat(socket, usuariosConectados);

    //? Evento que recibe información desde el contacto buscado en cliente
    StarChatNewContact(socket);
    
    //? Envio de mensaje privado a un usuario
    SendPrivateMessage(socket,io, usuariosConectados);

    //? Guardado de interactions: like, dislike, etc
     newInteractionNotification(socket, usuariosConectados, io)

     //?Aceptar contacto nuevo
     acceptContact(socket, usuariosConectados, io)

     //?Envio notification de comentario
     commentNotification(socket, usuariosConectados, io)
    

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

    socket.on("recoverMessages", async (roomName, usernameContact, sendername, contactId) => {
        try {
            const messages = await Message.find({ roomId: roomName }).sort({ id_offset: 1 });
            const contact = await Contact.find({contact_id:contactId, owner_id:socket.user._id }).populate("contact_id", "user_name email")
            //retornar el resultado del recorrido de messages buscando si exite uno o mas "emisores"
            let isFirstMessage = seeCountIds(messages);
            // console.log("Contacto Datos: ", contact);


            if (messages.length >0) {
                //! Aqui cambié porque emitia a todo el room, y cuando cambiaba de chat emergía tambien para el compañero de chat
                let contactState = contact[0].estado;
            
                // console.log("ESTADO DE MENSAJES ENTRE USUARIOS: ", isFirstMessage)
                // // console.log("Contacto Datos: ", contact);
                // console.log("Contacto estado: ", contactState);

                // io.to(roomName).emit('recoveredMessages', messages);
                socket.emit('recoveredMessages',socket.user._id, messages, usernameContact,sendername,contactId, isFirstMessage, contactState);
                
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
app.use(userRouter);
app.use(notifRoute)


const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`El servidor está escuchando por http://localhost:${PORT}/`);
});

connect();