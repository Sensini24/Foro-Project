import jsonwebtoken, { decode } from "jsonwebtoken";
import dotenv from "dotenv"
import { User } from "../Models/User.js";
import bcrypt from 'bcrypt';


export async function crearWebToken(Usuario){
    try{
        const payload = {
            _id:Usuario._id,
            user_name:Usuario.user_name,
            email:Usuario.email
        }

        // console.log("payload: ", payload)
        const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET,{
            expiresIn:'1h'
        });
        console.log(process.env.JWT_SECRET)
        return token

    }catch (error) {
        // Manejo del error
        throw new Error(error.message);
    }
}

export const verificarToken = (req, res, next) => {
    //*Obtener el token desde las cookies del navegador que se envio en auth
    const token = req.cookies.authToken;
    if (!token){
        // return res.status(401).send('Acceso denegado. No se proporcionó ningún token.');
        req.usuariodatospayload = null;
        res.locals.usuario = null;
        return next()
    }
    try {
        
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        // console.log("decoded: ", decoded)

        //*para dar la infroamcion del payload a las rutas que use este middleware
        req.usuariodatospayload = decoded;

        //* Pasar los datos a res.locals para que estén disponibles en las vistas
        res.locals.usuario = decoded; 
        // console.log("Datos usuario payload:", req.usuariodatospayload)
        // console.log("Token en cookies: ", req.cookies.authToken)
        next();
    } catch (error) {
        console.log('Token inválido o expirado');
        req.usuariodatospayload = null;
        res.locals.usuario = null;
        return res.redirect("/auth/login")
        // return res.status(401).send("Token inválido o expirado") ;
    }
};

export const verificarTokenObligatorio = (req, res, next) => {
    //*Obtener el token desde las cookies del navegador que se envio en auth
    const token = req.cookies.authToken;
    if (!token){
        console.log("NO PUEDE PASAR AQUI")
        return res.redirect("/post/postlist")
    }
    try {
        
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        console.log("decoded: ", decoded)

        //*para dar la infroamcion del payload a las rutas que use este middleware
        req.usuariodatospayload = decoded;
        // console.log("Datos usuario payload:", req.usuariodatospayload)
        // console.log("Token en cookies: ", req.cookies.authToken)
        next();
    } catch (error) {
        console.log('Token inválido o expirado');
        return res.redirect("/auth/login")
    }
};

export function saludo(req, res, next){
    console.log("Saludo middleware: hola Brandon");
    next();
}

export function limitarTexto(textocompleto){
    let limite = 120
    let textomostrar = ""
    for(var i = 0; textocompleto.length ; i++){
        textomostrar += textocompleto[i]
        limite--
        if(limite == 0){
            return textomostrar
        }        
    }
}