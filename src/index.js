import express from 'express'
import dotenv from "dotenv"
import { fileURLToPath } from 'url';
import {dirname, join} from 'path';
import postRoute from './Routes/postRoutes.js'
import commentRouter from './Routes/commentRoutes.js'
import authRoute from './Routes/authRoutes.js';
import connect from './database.js'
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import { verificarToken } from './Controllers/utils.js';
import routheTags from './Routes/tagsRoutes.js';
import { layoutRoute } from './Routes/layoutRoutes.js';


const __dirname =dirname(fileURLToPath(import.meta.url));

dotenv.config()
const app = express()

//Parsear cookies
app.use(cookieParser());

// PAra uqe pueda leer json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.use(layoutRoute)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`El servidor está escuchando por http://localhost:${PORT}/`);
});

connect();