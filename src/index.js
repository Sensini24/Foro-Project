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
import { layoutRoute } from './Routes/layoutRoutes.js';
import { Message } from './Models/MessageModel.js';
import { Socket } from 'dgram';

const __dirname =dirname(fileURLToPath(import.meta.url));

dotenv.config()
const app = express()


//? Why asi? En este caso se hace uso de solicitudes http en tiempo real, se usa para Socket.IO
const server = createServer(app);
const modelMessage = Message;
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

// 4. Manejar eventos de conexión después de configurar el middleware
io.on("connection", async (socket)=>{
    console.log("Usuario conectado ", socket.user, " con el id: ", socket.id)

    usuariosConectados.set(socket.user._id, {socketid:socket.id, nombre: socket.user.user_name  })
    console.log("Usuarios conectados: ", usuariosConectados)
    
    let result;
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
    io.emit("users connected", Array.from(usuariosConectados));

    //Atender peticion de chat privado
    socket.on("startprivatechat", (recipienteId)=>{
        //? EL recipiente no es mas que el id de usuario pasado previamente y luego adjudicado a un item de cliente uqe al clicar nos devuelve dicho id, el cual servira como key para obtener el socket almacenado en un map mas arribita.
        const recipientSocketId = usuariosConectados.get(recipienteId)?.socketid;

        if(recipientSocketId){
            //EN caso de que exista, ordenamo y unimo el id del usuario actual mas el del usuario con quie queremos hablar.
            console.log(`Iniciando chat privado entre ${socket.user._id} y ${recipienteId}`);
        
            // Crear un nombre único para la sala
            const roomName = [socket.user._id, recipienteId].sort().join("-");
            
            //Nos unimos al room
            socket.join(roomName);
            io.to(recipientSocketId).emit('privateChatStarted', socket.user._id, roomName, socket.user.user_name);
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
    socket.on("privateMessage", ({ roomName, message }) => {
        io.to(roomName).emit("sendMessage", {
            sender: socket.user.user_name,
            message,
        });
    });

    // console.log("sds: " , usuariosConectados)
    // Manejo de reconexión "manualmente", es decir con el uso de una guia "offset" y una base de datos.
    if (!socket.recovered) {
        try {
            //! Obtenemos el ultimo offset registrado en cliente.
            const lastOffset = socket.handshake.auth.serverOffset || 0;

            //Obtenenemo los mensaje cuentan con un offset mayor al del registrado por ultima vez en el cliente
            const messages = await Message.find({ id_offset: { $gt: lastOffset } }).sort({ id_offset: 1 });

            // recorremos los mensaje, creamos suscripcion y enviamos los datos junto con los parametros.
            if(messages){
                console.log("Mensajes recuperados");
                messages.forEach(message => {
                    socket.emit('chat message', message.content, message.id_offset);
                });
            }else{
                console.log("NO SE ENCONTRARON DATOS");
            }
            
        } catch (e) {
            console.log("Error al recuperar mensajes perdidos: ", e);
        }
    }

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
app.use(chatRoute)


const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`El servidor está escuchando por http://localhost:${PORT}/`);
});

connect();